import Link from 'next/link';
import { useState } from 'react'

export default function Menu () {
    const [open, setOpen] = useState(false)
    function toggleMenu () {
        setOpen(!open)
    }

    return (<>
        <button title="Open the navigation menu" id="menuButton" onClick={toggleMenu} className={`amh-menuButton${open?' open':''}`}>
            <svg id="circle-path" width="100%" height="100%" viewBox="0 0 250 250" style={{display: "none", fillRule:"evenodd", clipRule:"evenodd", strokeLinejoin:"round", strokeMiterlimit:2, }}>
                <path d="M125,0C193.989,0 250,56.011 250,125C250,193.989 193.989,250 125,250C56.011,250 0,193.989 0,125C0,56.011 56.011,0 125,0ZM125,4.167C191.69,4.167 245.833,58.31 245.833,125C245.833,191.69 191.69,245.833 125,245.833C58.31,245.833 4.167,191.69 4.167,125C4.167,58.31 58.31,4.167 125,4.167Z"/>
            </svg>
            <svg width="100%" height="100%" viewBox="0 0 250 250" style={{fillRule:"evenodd", clipRule:"evenodd", strokeLinecap:"round", strokeLinejoin:"round", strokeMiterlimit:1.5, }}>
                <path d="M125,0C193.989,0 250,56.011 250,125C250,193.989 193.989,250 125,250C56.011,250 0,193.989 0,125C0,56.011 56.011,0 125,0ZM125,7.167C191.69,7.167 242.833,58.31 242.833,125C242.833,191.69 191.69,242.833 125,242.833C58.31,242.833 7.167,191.69 7.167,125C7.167,58.31 58.31,7.167 125,7.167Z"/>
                <g transform="matrix(0.76659,0,0,1,38.7426,22.3809)">
                    <path d="M58.81,72.698L166.111,72.698" className="menuLine"/>
                </g>
                <g transform="matrix(0.76659,0,0,1,38.7426,82.2222)">
                    <path d="M58.81,72.698L166.111,72.698" className="menuLine"/>
                </g>
                <g transform="matrix(0.76659,0,0,1,52.8354,50.9524)">
                    <path d="M58.81,72.698L166.111,72.698" className="menuLine"/>
                </g>
            </svg>
        </button>

        <nav id="navMenu" className={`amh-navMenu${open?' open melt-enter-active':''}`}>
            <div className="color-bars">
                <div style={{ height: `100vh`, width: 'calc(24px * 6.5)', background: '#286EEB' }}>
                    <div className="bar" style={{ height: `100vh`, width: 'calc(24px * 5)', background: '#D44220' }}>
                        <div className="bar" style={{ height: `100vh`, width: 'calc(24px * 4)', background: '#FFC627' }}>
                            <div className="bar" style={{ height: `100vh`, width: 'calc(24px * 3)', background: '#00C8CB' }}>
                                <div className="bar" style={{ height: `100vh`, width: 'calc(24px * 2)', background: '#FF84B7' }}>
                                    <div className="bar" style={{ height: `100vh`, width: 'calc(24px * 1)', background: '#FFFFFF' }}>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul>
                <li onClick={toggleMenu}>
                    <Link href='/'>
                        <a>Home</a>
                    </Link>
                </li>
                <li onClick={toggleMenu}>
                    <Link href='/posts'>
                        <a>Posts</a>
                    </Link>  
                </li>
            </ul>
        </nav>

        {null /* <style jsx global>{`
            .color-bars {
                position: absolute;
                height: 100%;
                left: 0;
                top: 0;
                width: 132px;
                background: #fff;
                display: flex;
                flex-direction: row;
                z-index: 50;
            }
            .color-bars .bar {
                box-sizing: content-box;
                -webkit-box-shadow: 5px 0px 15px 3px rgba(0,0,0,0.23); 
                box-shadow: 5px 0px 15px 3px rgba(0,0,0,0.23);
                transition: padding 500ms ease-out;
            }
            .color-bars .bar:hover {
                width: 24px;
                -webkit-box-shadow: 5px 0px 15px 3px rgba(0,0,0,0.23); 
                box-shadow: 5px 0px 15px 3px rgba(0,0,0,0.23);
                padding-right: 12px;
            }

            button {
                outline: none;
                background: none;
                border: none;
            }
            .amh-menuButton {
                background-color: rgba(0,0,0,0);
                position: fixed;
                top: 0; right: 0;
                width: 4rem;
                height: 4rem;
                margin: 1.5rem calc(1.5rem + 24px) 0 0;
                border-radius: 9999px;
                z-index: 50;
                display: flex;
                stroke: #3B8EF3;
                fill: #3B8EF3;
                clip-path: url(#circle-path);
                transition: color 100ms linear 550ms;
            }
            .amh-menuButton.open {    
                stroke: #D8FBF2;
                fill: #D8FBF2;
                transition: color 100ms linear 0s;
            }
            .amh-navMenu {
                position: fixed;
                width: 100%;
                height: 100%;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #286EEB;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: clip-path 650ms, opacity 150ms linear 1s;
                clip-path: circle(2rem at calc(100% - 5rem) 3.5rem);
                -webkit-clip-path: circle(2rem at calc(100% - 5rem) 3.5rem);
            }
            .amh-navMenu.open {
                display: flex;
                opacity: 1;
                transition: clip-path 650ms, opacity 100ms linear;
                clip-path: circle(100%);
                -webkit-clip-path: circle(100%);
            }

            #navMenu ul {
                margin: 0;
                margin-top: 8vh;
                padding: 0;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                margin-left:-60px;
            }

            #navMenu ul::after {
                content: '';
                clear: both;
                display: block;
            }

            #navMenu li {
                display: block;
                margin-bottom: 1.5rem;
            }
        
            #navMenu li:hover{
                background-position: 0 100%;
                background-size: auto 6px;
                background-repeat: repeat-x;
                text-decoration: none;
            }

            #navMenu a {
                text-decoration: none;
                text-transform: uppercase;
            }

            #navMenu a {
                font-size: 1.5rem;
                line-height: 2.25rem;
                font-weight: bold;
                color: #fff;
            }
            .menuLine {
                fill: none;
                stroke-width: 9px;
            }
        `}</style> */}

    </>)
}