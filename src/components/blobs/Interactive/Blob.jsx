import useBlob from './useBlob'

export default function Blob ({}) {
    useBlob("#interactive-blob-canvas", ".canvas-container")
    return (<>
        {null /* <style jsx>{`
            canvas {
                width: 100%;
                height: 100%;
            }
            .canvas-container {
                width: 100%;
                height: 100%;
            }
        `}</style> */}
        <div className="canvas-container">
            <canvas id="interactive-blob-canvas" />
        </div>
    </>)
}