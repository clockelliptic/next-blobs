import Header from '../HomeHeader'
import Footer from '../HomeFooter'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import FaceIcon from '@material-ui/icons/Face';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import BgMorph from './BgMorph'
import { useEffect, useState } from 'react';
import $state from '../sharedState'
import disableScroll from 'disable-scroll';


const HomeLayout = ({ children }) => {
  const [showBgMorph, setShowBgMorph] = useState(false)
  const [scrollLock, setScrollLock] = useState(true);

  const updateScrollState = () => {
    const s = $state.section;
    const nearest = Math.round(window.pageYOffset / window.innerHeight);

    if (nearest !== s()) s(nearest);
    setShowBgMorph( (nearest > 0) && (s() < totalNSections()-1));
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener('scroll', () => throttle(onScroll, 100))

    if (scrollLock) {
      disableScroll.on(null, { disableScroll: false })
    } else {
      disableScroll.off()
    }

  }, [scrollLock])

  function onScroll() {
    updateScrollState()
  }

  function nextSection() {
    updateScrollState()
    const anotherSection: boolean = (pageHeight() - window.pageYOffset + window.innerHeight) > window.innerHeight;
    if (anotherSection) triggerScroll(($state.section()+1) * window.innerHeight);
  }
  function prevSection() {
    updateScrollState()
    if ($state.section() > 0) triggerScroll(($state.section() - 1) * window.innerHeight);
  }
  function toTop() {
    triggerScroll(0)
  }
  function unlockScroll() {

  }

  function triggerScroll(top: number) {
    window.scrollTo({top, behavior: 'smooth'})
  }

  return (<>
      <div className={`animatedBg${ showBgMorph ? ' showBgMorph' : '' }`}>
        <BgMorph />
      </div>
		  <Header />
      <main>
        <div>{children}</div>
      </main>
      <Footer />

      <div className="parallax-bars">
        <div className="bar" style={{ height: `300vh`, background: '#FF84B7' }}></div>
        <div className="bar" style={{ height: `400vh`, background: '#00C8CB' }}></div>
        <div className="bar" style={{ height: `500vh`, background: '#FFC627' }}></div>
        <div className="bar" style={{ height: `600vh`, background: '#D44220' }}></div>
        <div className="bar" style={{ height: `700vh`, background: '#286EEB' }}></div>
      </div>

      <div className="section-nav-buttons">
          <a onClick={() => {}} role="button" title="Give Feedback" className="iconbutton gray feedback"><FaceIcon fontSize="large" htmlColor="#fff" /></a>
          <a onClick={unlockScroll} role="button" title="Unlock Manual Scroll" className="iconbutton gray unlock"><LockOpenIcon fontSize="large" htmlColor="#fff" /></a>
          <a onClick={toTop} role="button" title="Back To Top" className="iconbutton gray top"><ArrowUpwardIcon fontSize="large" htmlColor="#fff" /></a>
          <a onClick={prevSection} role="button" title="Previous Section" className="iconbutton prev"><FirstPageIcon fontSize="large" htmlColor="#fff" /></a>
          <a onClick={nextSection} role="button" title="Next Section" className="iconbutton next"><LastPageIcon fontSize="large" htmlColor="#fff" /></a>
      </div>

      <style jsx global>{`
        .animatedBg {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
          align-items: center;
          display: flex;
          justify-content: center;
          transition: all 1s ease-out;
          transform: scale(0);
        }
        .showBgMorph {
          transition: all 1s ease-out;
          transform: scale(1);
        }
        .section-nav-buttons {
          position: fixed;
          z-index: 51;
          bottom: 3rem;
          max-height: 0px;
          display: flex;
          justify-content: flex-end;
          right: 0;
        }
        .iconbutton {
          cursor: pointer;
          positon: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 32px;
          background: #286EEB;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .iconbutton:hover {
          background: #1056d4;
        }
        .iconbutton.gray {
          background: #ccccdc;
        }
        .iconbutton.gray:hover {
          background: #498FFF;
        }
        .iconbutton.next {
          margin-right: 2rem;
        }
        body {
          margin: 0;
          color: #333;
          background: url('/dot.svg') repeat fixed;
          background-size: 16px 16px;
        }
        main {
          position: relative;
        }
        .parallax-bars {
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          width: 120px;
          background: #fff;
          display: flex;
          flex-direction: row-reverse;
          z-index: 50;
        }
        .parallax-bars .bar {
          width: 24px;
          box-shadow: 0px 10px 42px -18px rgba(0,0,0,0.75);
          -webkit-box-shadow: 0px 10px 42px -18px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 10px 42px -18px rgba(0,0,0,0.75);
        }
      `}</style>
  </>);

  function totalNSections () {
    return Math.floor(pageHeight()/window.innerHeight)
  }

  function htmlAndBody() {
    return [document.documentElement, document.body]
  }

  function pageHeight() {
    const [html, body] = htmlAndBody();
    return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  }

  let timerId;
  function throttle (func, delay) {
      if (timerId) return;
      timerId  =  setTimeout(() => {
          func();
          timerId  =  undefined;
      }, delay)
  }
}
export default HomeLayout;