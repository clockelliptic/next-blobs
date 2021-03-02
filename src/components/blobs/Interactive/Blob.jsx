import { useState, createRef } from 'react'
import useBlob from './useBlob'

export default function Blob ({isRunning}) {
    const [ canvasRef, canvasParentRef ] = [ createRef(null), createRef(null) ]
    useBlob(canvasRef, canvasParentRef)

    return (<>
        <style jsx>{`
            canvas {
                width: 100%;
                height: 100%;
            }
            .canvas-container {
                width: 100%;
                height: 100%;
            }
        `}</style>
        <div ref={canvasParentRef} className="canvas-container">
            <canvas ref={canvasRef} id="interactive-blob-canvas" />
        </div>
    </>)
}