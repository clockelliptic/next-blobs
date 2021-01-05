import { useEffect, createRef, useState } from 'react'
import { makeVar } from '@apollo/client';
import defaultBlobs from '../defaultBlobs'
import * as d3 from 'd3'


export default function useGasblobs () {
    let sceneKey = 1;

    const [kill, setKill] = useState(false);

    /* Canvas setup */
    let canvas = createRef(), 
        canvasWidth = makeVar(null), 
        canvasHeight = makeVar(null);

    const onResize = (window) => () => {
        try {
            canvasWidth(window.innerWidth)
            canvasHeight(canvas.current.clientHeight || canvas.current.offsetHeight);
            let m = { type: 'resize', canvasWidth: canvasWidth(), canvasHeight: canvasHeight() };
            throttle(() => worker.postMessage(m), 100)
        } catch (err) {
            console.log("ERROR ON RESIZE HANDLER: ", err)
        }
    }

    /* engine configuration */
    const blobs = defaultBlobs,
          segmentRadius = 14,
          gasParticleRadius = 32,
          showGas = false;

    let	temperature = 10,
        numGasParticles = 20;
    
    /* data */
    const data = { 
        current: {
            particles: [],
            gas: [],
            links: [],
            exploded: false,
            exploded_once: false
        } 
    }

    let worker;

    useEffect(() => {
        /*
            SET INITIAL SCENE SIZE & RESIZE HANDLER
        */
        canvasWidth(window.innerWidth)
        canvasHeight(canvas.current.clientHeight || canvas.current.offsetHeight);
        window.addEventListener('resize', onResize(window));

        /*
            INITIALIZE WORKER THREAD
        */
       worker = new Worker('./worker/GasblobsWorker.js')
       worker.onmessage = function(event) {
           switch (event.data.type) {
               case "init": return onWorkerInitialized(event.data.data);
               case "tick": return ticked(event.data.data);
               case "explode": return ticked(event.data.data, { explode: true });
               case "end": return;
           }
       };
        /*
            START THE DAMN THING
        */
        initBlobEngine();

        /*
            END CONDITIONS
        */
       setTimeout(() => {
            setKill(true)
            setTimeout(() => {
                worker.postMessage({ type: 'end' })
            }, 2500)
            setTimeout(() => {
                worker.terminate()
            }, 3500)
        }, 10250)

        /*
            CLEANUP
        */
        return () => {
            try {
                window.removeEventListener('resize', onResize(window));
                worker.terminate()
            } catch {
                console.error("Interminable blobthread strikes again (╯°□°）╯︵ ┻━┻")
            }
        }

    }, [])





    return [ blobs, canvas, sceneKey, kill ];





    /*
        COPIES DATA FROM WORKER THREAD TO LOCAL DATA STORE
    */
    function ticked (newParticles, opts = { explode: false}) {
        data.current.particles = newParticles.blobs;
        data.current.links = newParticles.links; 
        if (opts.explode) { 
            data.current.exploded = true;
            console.log("client explode")
        }
        if (showGas) data.current.gas = newParticles.gas;
    }

    /* *********************************************
        STARTS THE d3 FORCE GRAPH ON WORKER THREAD
        STARTS SVG SCENE RENDERING

         !!!!  IMPORTANT: this is called onMount in useEffect hook  !!!!
    ********************************************* */
   function initBlobEngine () {
        initSVGScene()
        initWorker()
        /*
            now the engine waits for the worker to trigger onWorkerInitialized()
        */
        requestAnimationFrame(update);
    }
        function initSVGScene() {

        }
        function initWorker () {
            worker.postMessage({
                type: 'init', 
                canvasWidth: canvasWidth(), 
                canvasHeight: canvasHeight(),
                blobs, temperature, segmentRadius,
                numGasParticles, gasParticleRadius
            });
        }
            
   /* *********************************************
        POPULATES THE SCENE WITH INITIAL DATA
        STARTS THE ANIMATION LOOP
            - triggered when the Worker returns its init message
    ********************************************* */
   function onWorkerInitialized (newParticles) {
        data.current.gas = newParticles.gas;
        data.current.particles = newParticles.blobs;
        requestAnimationFrame(update)
    }

    /* *********************************************
        TWEEN UPDATE FUNCTIONS
    ********************************************* */
    async function update() {
        try {
            blobDigest()
            //if (showGas) gasDigest();
        } catch (err) {
            console.log("ERROR ON FRAME UPDATE: ", err)
        }
        requestAnimationFrame(update);
    }

    function blobDigest() {
        const {particles, links} = data.current;

        blobs.forEach((_, i) => {
            let nodes = particles[i]
            try {
                particleDigest(nodes, i)
                linkDigest(particles, links, i)
            } catch (err) {
                console.log("ERR ON LINK DIGEST: ", err)
            }
        })
    }

    function particleDigest(nodes, index) {
        let particle = d3.select(`svg#canvas-${sceneKey} g#g${index}`).selectAll('circle.particle').data(nodes);
        particle.exit().remove();
        particle
            .merge(
                particle.enter().append('circle')
                    .classed('particle', true)
                    .attr('r', d=> data.current.exploded_once ? d.r*2 : d.r)
                    .attr('fill', d => d.color)
            )
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }

    function linkDigest(blobs, links, index) {
        let link = d3.select(`svg#canvas-${sceneKey} g#g${index}`).selectAll('line.link').data(links);
        link.exit().remove()
            
        if (data.current.exploded) {
            worker.postMessage({
                type: 'exploded', 
                canvasWidth: canvasWidth(), 
                canvasHeight: canvasHeight()
            })
            data.current.exploded_once = true;
            data.current.links = []
        } else {
            link.merge(
                link.enter()
                    .append('line')
                    .classed('link', true)
                    .attr('stroke', d => d.color)
                    .attr('stroke-width', d => 2*segmentRadius)
            )
            .attr('x1', (d) => extractCoord(blobs, d, 'x'))
            .attr('y1', (d) => extractCoord(blobs, d, 'y'))
            .attr('x2', (d) => extractCoord(blobs, d, 'x'))
            .attr('y2', (d) => extractCoord(blobs, d, 'y'))
        } 
    }

    function extractCoord (blobs, d, coord) {
        try {
            for (let i = 0; i< blobs.length; i++) {
                if (blobs[i].hub === d.source.hub) {
                    for (let j = 0; j<blobs[i].length; j++){
                        if (blobs[i][j].id===d.source.id) return blobs[i][j][coord]
                    }
                }
            }
        } catch (err) {
            console.log("ERROR EXTRACTING COORD: ", err)
        }
    }

    function gasDigest() {
        const {particles} = data.current;
        let particle = svgcanvas.current.selectAll('circle.gas').data(particles.filter(x => x.type === 'gas'));

        particle.exit().remove();
        particle
            .merge(
                particle.enter().append('circle')
                    .classed('gas', true)
                    .attr('r', d=> d.r)
                    .attr('fill', d => d.color)
            )
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }

    /* *********************************************
        THROTTLE (for resize handler)
    ********************************************* */
    let timerId;
    function throttle (func, delay) {
        if (timerId) return;
        timerId  =  setTimeout(() => {
            func();
            timerId  =  undefined;
        }, delay)
    }
}