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
        <div className="canvas-container" style={{width: '100%', minHeight: '100vh'}}>
            <canvas id="interactive-blob-canvas" style={{width: '100%', height: '100%'}}/>
        </div>
    </>)
}