import useGasblobs from './useGasblobs'
import * as d3 from 'd3'

export default function Blobs () {

    const [ blobs, canvas, sceneKey, kill ] = useGasblobs()

    return (<>
        <style jsx>{`
            .gooey {
                filter:url("#gooey")
            }
            .canvas {
                width: 100%;
                min-height: 100vh;
                transition: opacity 750ms ease-out;
            }
            .invis {
                opacity: 0;
            }
        `}</style>
        <svg id={`canvas-${sceneKey}`} ref={canvas} className={`canvas${kill ? ' invis' : ''}`}>
            <defs>
                <filter id="gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                </filter>
            </defs>
            {
                d3.range(blobs.length).map((x) => <g id={`g${x}`} key={`blobgroup-${x}`} className="gooey"></g>)
            }
        </svg>
    </>)
}