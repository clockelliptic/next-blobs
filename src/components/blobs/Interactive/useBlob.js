import { useLayoutEffect } from 'react'

export default function useBlob (canvasRef, canvasParentRef) {
  let worker;
  let data = {
    toDraw: []
  }

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const canvasContainer = canvasParentRef.current; 
    const ctx = canvas.getContext('2d');
    canvas.setAttribute('touch-action', 'none');

    worker = new Worker('./worker/interactiveBlobWorker.js')
    
    worker.onmessage = function(event) {
        switch (event.data.type) {
            case 'init': return run(canvas, ctx, data, event.data.data);
            case "tick": return ticked(data, event.data.data);
            case "explode": return ticked(event.data.data, { explode: true });
            case "end": return;
        }
    };

    window.addEventListener('pointermove', e => handleMouse({ x: e.clientX, y: e.clientY }, worker));
    window.addEventListener('resize', handleResize);
    handleResize(worker);
    
    initWorkerLoop(worker)

    function handleResize() {
      try {
        canvas.width = canvasContainer.clientWidth || canvasContainer.offsetWidth;
        canvas.height = canvasContainer.clientHeight || canvasContainer.offsetHeight;
      
        worker.postMessage({
          type: 'resize',
          data: {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          }
        })
      } catch (err) {
        console.error("ERROR ON CLIENT RESIZE:", err, canvasRef, canvasParentRef, worker)
      }
    }
  }, [])

  function ticked(data, new_data) {
    data.toDraw = new_data.toDraw;
  }
  
  function run(canvas, ctx, data, new_data) {
    ticked(data, new_data)
    animationLoop(canvas, ctx, data)
  }
  
  function initWorkerLoop (worker) {
    const canvas = canvasRef.current;
    const canvasContainer = canvasParentRef.current; 
  
    canvas.width = canvasContainer.clientWidth || canvasContainer.offsetWidth;
    canvas.height = canvasContainer.clientHeight || canvasContainer.offsetHeight;
    worker.postMessage({
        type: 'init',     
        data: {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height
        }
    });
  }
  
  function handleMouse(mouse, worker) {
    worker.postMessage({
      type: 'mousemove',
      data: {
        mouse
      }
    })
  }
  
  function animationLoop (canvas, ctx, data) {
    updateCanvas(canvas, ctx, data)
    requestAnimationFrame(() => animationLoop(canvas, ctx, data))
  }
  
  function updateCanvas(canvas, ctx, { toDraw }){
    const points = toDraw;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();

    for(let i = 0; i < points.length; i++) {
      const { curve, x, y, xc, yc } = points[i];

      if (curve === 'linear') {
        ctx.moveTo(x, y);
      } else if (curve === 'quadratic') {
        ctx.quadraticCurveTo(x, y, xc, yc);
      }
      
      ctx.fillStyle = '#286EEB';
    }
    
    ctx.fillStyle = '#286eeb';
    ctx.fill();
    ctx.strokeStyle = '#286EEB';
  }
  

}