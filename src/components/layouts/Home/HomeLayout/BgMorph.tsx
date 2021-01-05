import { useState, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring'



export default function BgMorph() {
    const paths = [
      "M435.5,299.5Q439,349,406.5,389.5Q374,430,324,441Q274,452,231,433Q188,414,126.5,414Q65,414,38,361.5Q11,309,12,250.5Q13,192,38.5,138.5Q64,85,117,62Q170,39,220.5,57Q271,75,326,67.5Q381,60,397,112Q413,164,422.5,207Q432,250,435.5,299.5Z",
      "M457.5,301Q445,352,402.5,380.5Q360,409,319,444Q278,479,224,469.5Q170,460,132.5,423.5Q95,387,68,344.5Q41,302,46.5,251.5Q52,201,78.5,161.5Q105,122,141.5,90.5Q178,59,225.5,60Q273,61,323.5,66Q374,71,404,112.5Q434,154,452,202Q470,250,457.5,301Z",
      "M440.5,289Q384,328,365,372Q346,416,298,429.5Q250,443,192,446.5Q134,450,112,396Q90,342,68.5,296Q47,250,73.5,206.5Q100,163,131.5,131Q163,99,206.5,62.5Q250,26,311,32.5Q372,39,379.5,105Q387,171,442,210.5Q497,250,440.5,289Z"
    ];

    const [pathIndex, setPath] = useState(0);
    const scrollState = {
      d: 0
    }

    useEffect(() => {
        const onScroll = () => {
          scrollState.d = window.pageYOffset
          const s = Math.round(scrollState.d / window.innerHeight);

          const triggerable = (scrollState.d % window.innerHeight) >= 128,
                delta = s !== pathIndex;

          if (delta && triggerable) setPath(s%paths.length);
        }
        onScroll();
        window.addEventListener('scroll', () => throttle(onScroll, 100))
    }, [])

    const { svg } = useSpring({
        config: { mass: 10, tension: 500, friction: 40 },
        svg: pathIndex
    });
  
    return (
      <div className="c">
        <style jsx>{`
            .c, svg {
                width: 100%;
                height: 100%;
            }
        `}</style>
        <svg
          viewBox="0 0 500 500"
        >
          <animated.path
            fill="#00000011"
            transform="translate(10 10) scale(1)"
            d={svg.interpolate({ range: [0,1], output: paths})}
          />
          <animated.path
            fill="transparent"
            stroke="#286EEB"
            strokeWidth="0.5px"
            transform="translate(-15 -15) scale(1.1)"
            d={svg.interpolate({ range: [0,1], output: paths})}
          />
          <animated.path
            fill="transparent"
            stroke="#00C8CB"
            strokeWidth="0.5px"
            transform="translate(-35 -35) scale(1.2)"
            d={svg.interpolate({ range: [0,1], output: paths})}
          />
          <animated.path
            fill="transparent"
            stroke="#FFC627"
            strokeWidth="0.5px"
            transform="translate(-55 -55) scale(1.3)"
            d={svg.interpolate({ range: [0,1], output: paths})}
          />
          <animated.path
            fill="transparent"
            stroke="#FF84B7"
            strokeWidth="0.5px"
            transform="translate(-75 -75) scale(1.4)"
            d={svg.interpolate({ range: [0,1], output: paths})}
          />
        </svg>
      </div>
    );

    let timerId;
    function throttle (func, delay) {
        if (timerId) return;
        timerId  =  setTimeout(() => {
            func();
            timerId  =  undefined;
        }, delay)
    }
  }