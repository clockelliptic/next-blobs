import { useLayoutEffect, createRef } from 'react'
import hoverEffect from './useHoverEffect'  

export default function ImageHoverDistort({ img1, img2 }) {
    const hoverEffectRef = createRef(null);

    useLayoutEffect(() => {
        const fx = new hoverEffect({
            parent: hoverEffectRef.current,
            intensity: 0.3,
            image1: img1,
            image2: img2,
            displacementImage: '/heightMap.png',
            imagesRatio: 1
        });
    }, [])

    return (
        <div className="co">
            <div className="fx" ref={hoverEffectRef} />
        <style jsx>{`
            .co {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
            .fx {
                width: 100%;
                height: 100%;
            }
        `}</style>
        </div>
    )
}