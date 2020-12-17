import { useEffect, createRef, useState } from 'react'
import { makeVar } from '@apollo/client';
import defaultBlobs from './defaultBlobs'
import * as d3 from 'd3'

export default function Blobs () {
    let sceneKey = 1;
    const blobs = defaultBlobs;
    const showGas = false;

    const [topMarginAdjust, setTopMarginAdjust] = useState(0)

    /* Canvas setup */
    let canvas = createRef(), 
        canvasWidth = makeVar(null), 
        canvasHeight = makeVar(null);

    let onResize = () => {};

    /* engine configuration */
    const numBlobs = 4,
          segmentRadius = 12,
          gasParticleRadius = 20;

    let	temperature = 6,
        numGasParticles = 14;
    
    /* data */
    const data = { current: {
        particles: [],
        gas: [],
        links: []
    } }

    let worker;

    useEffect(() => {
        setTopMarginAdjust(-1 * Number(document.getElementById('global-header').clientHeight))
        const svgCanvas = d3.select(`svg#canvas-${sceneKey}`)
                            .attr('width', canvasWidth())
                            .attr('height', canvasHeight());
        /*
            SET INITIAL SCENE SIZE & RESIZE HANDLER
        */
        canvasWidth(window.innerWidth)
        canvasHeight(canvas.current.clientHeight || canvas.current.offsetHeight);
        window.addEventListener('resize', onResize);

        onResize = () => {
            canvasWidth(window.innerWidth)
            canvasHeight(canvas.current.clientHeight || canvas.current.offsetHeight);
            let m = { type: 'resize', canvasWidth: canvasWidth(), canvasHeight: canvasHeight() };
            throttle(() => worker.postMessage(m), 100)
        }

        /*
            INITIALIZE WORKER THREAD
        */
       worker = new Worker('./worker/BlobWorker.js')
       worker.onmessage = function(event) {
           switch (event.data.type) {
               case "init": return onWorkerInitialized(event.data.data);
               case "tick": return ticked(event.data.data);
               case "end": return;
           }
       };
        /*
            START THE DAMN THING
        */
        initBlobEngine();

        /*
            CLEANUP
        */
        return () => {
            try {
                worker.terminate()
            } catch {
                console.error("Interminable blobthread strikes again (╯°□°）╯︵ ┻━┻")
            }
        }

    }, [])


    /*
        COPIES DATA FROM WORKER THREAD TO LOCAL DATA STORE
    */
    function ticked (newParticles) {
        data.current.particles = newParticles.blobs;
        data.current.links = newParticles.links;
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
    function update() {
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
                    .attr('r', d=> d.r)
                    .attr('fill', d => d.color)
            )
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    }

    function linkDigest(blobs, links, index) {
        let link = d3.select(`svg#canvas-${sceneKey} g#g${index}`).selectAll('line.link').data(links);
        link.exit().remove()
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

    return (<>
        <style jsx>{`
            .gooey {
                filter:url("#gooey")
            }
            .canvas {
                width: 100%;
                min-height: 100vh;
                margin-top: ${ topMarginAdjust }px;
            }
        `}</style>
        <svg id={`canvas-${sceneKey}`} ref={canvas} className="canvas">
            <defs>
                <filter id="gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                </filter>
            </defs>
            {
                d3.range(numBlobs).map((x) => <g id={`g${x}`} key={`blobgroup-${x}`} className="gooey"></g>)
            }
        </svg>
    </>)
}