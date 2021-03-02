import { InferGetStaticPropsType } from 'next'
import Blobs from '@dolly/components/blobs/Gasblobs/Gasblobs'
import Blob from '@dolly/components/blobs/Interactive/Blob'
import Image from "next/image"  
import { useLayoutEffect, useState } from 'react'
import ParallaxFrame from '@dolly/components/images/ParallaxFrame'
import ImageHoverDistortNoSSR from '@dolly/components/images/ImageHoverDistort/ImageHoverDistortNoSSR'
import PulseHeading from '@dolly/components/blobs/PulseHeading'
import $state from '@dolly/components/layouts/Home/sharedState'

export const getStaticProps = (context) => {
  return {
    props: {

    } // passed to component as props
  }
}

export default function Home({props}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [showInteractiveBlob, setShowInteractiveBlob] = useState(false)

  useLayoutEffect(() => {
    if (window.pageYOffset > 0) setShowInteractiveBlob(true);
    setTimeout(() => setShowInteractiveBlob(true), 11000)
  }, [])

  const sections = [
    {
      title: "What is Clockelliptic?",
      text: "In an increasingly digital landscape, innovating visual and emotive methods of connecting consumers to your brand is critical to your success. We create comprehensive solutions that utilize custom brand & web designs, sophisticated business technologies, and optimized marketing strategies to offer a growth blueprint that drives results and actually works— for you. ",
      img1: "/wink-office.jpg",
      img2: "/looking-at-code.jpg",
      color: "#FF84B7"
    },
    {
      title: "What we do",
      text: "Brand identity, websites and apps, marketing strategy",
      img1: "/looking-at-code.jpg",
      img2: "/animated-image.gif",
      color: "#00C8CB"
    },
    {
      title: "Brand Identity",
      text: "We work with start-up and established brands to leverage your unique essence, translate it into marketable qualities, and design digital + print collateral, including primary and secondary logos, badges, icons, business cards, brochures, stationery, and more.",
      img1: "/animated-image.gif",
      img2: "/chocolate.jpg",
      color: "#FFC627"
    },
    {
      title: "Photography",
      text: `From commercial photography to team portraits, the Clockelliptic Studio team will make sure your photoshoot goes off without a hitch. You bring the glamor –we'll provide the "it factor" that makes your brand irresistible on social media, your website, or even your company newsletters.`,
      img1: "/chocolate.jpg",
      img2: "/computer-and-phone.png",
      color: "#D44220"
    },
    {
      title: "Marketing Strategy",
      text: "Good marketing is a direct result of great strategy and a team that knows your services inside and out. It helps that we understand the consumer market because we are consumers, too. We don’t want to waste your money any more than you do – that’s why we implement a range of result-driven marketing strategies and actions to deliver solutions tailored toward your target demographic.",
      img1: "/computer-and-phone.png",
      img2: "/wink-office.jpg",
      color: "#286EEB"
    }
  ]

  return (<>
    <section className="hero colorbar-left heading" style={{ borderColor:'#FFFFFF' }}>
      <div className="hero-animation">
        {
          !showInteractiveBlob
            ? <Blobs />
            : null
        }
      </div>
      <div className={`interactive-blob${showInteractiveBlob ? '' : ' hide'}`}>  
        {
          showInteractiveBlob
            ? <Blob />
            : null

        }

        <div className="hero-content">
          <div className="container">
            <div className="wink-computer">
              <div style={{
                height: '132',
                marginBottom: '-128px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '4rem', fontFamily: 'BwModelica', color: 'white', fontWeight: '900',
              }}>
              </div>
              <div style={{ width: '0px', height: '140px'}} />
              <div style={{
                height: '132',
                marginBottom: '-128px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontSize: '4rem', fontFamily: 'BwModelica', color: 'white', fontWeight: '900',
              }}>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-content">
        <div className="container">
          <div className="wink-computer">
            <div style={{ width: '140px', height: '140px'}} />
            <Image src={`/computer.png`} alt={''} width={250} height={140} />
            <div style={{ width: '140px', height: '140px'}} />
          </div>
        </div>
      </div>
    </section>

    <section className={`flex-section colorbar-right`} style={{ borderColor: 'transparent' }}>
      <div className="content-container">
        <PulseHeading />
      </div>
    </section>

    {
      sections.map((s, i) => (
        <section className={`flex-section colorbar-right${i%2===0 ? ' reverse' : ''}${i===0 ? ' _secondEl' : ''}`} style={{ borderColor: 'transparent' }}>
          <div className="content-container">
            <div className="half desc" style={{ paddingLeft: i%2===0 ? 'auto' : `${120 - i*24}px` }}>
              <svg className="blob-bg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#00000000" d="M55.3,-63.8C68.2,-55.2,72.6,-34.4,68.3,-18.1C64,-1.8,50.9,10,41.3,21.3C31.8,32.5,25.6,43.1,13.9,54.5C2.1,65.9,-15.4,78,-33,77.4C-50.6,76.7,-68.5,63.3,-69.3,47.1C-70.2,31,-54.1,12.1,-50.3,-8.8C-46.6,-29.7,-55,-52.7,-48.7,-62.4C-42.3,-72.2,-21.2,-68.7,0,-68.7C21.2,-68.8,42.5,-72.4,55.3,-63.8Z" transform="translate(100 100)" />
              </svg>
              <div className="blurb">
                <h1>{ s.title }</h1>
                <p>{ s.text }</p>
              </div>
            </div>
            <div className="half img" style={{ minWidth: i%2===0 ? `calc(50vw - ${136 - i*24}px)` : '50vw', marginLeft: i%2===0 ? `calc(${120 - i*24}px)` : "0" }}>
              <div className="photo-frame">
                <div className="photo">
                  <ParallaxFrame>
                    <ImageHoverDistortNoSSR img1={s.img1} img2={s.img2} />
                  </ParallaxFrame>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))
    }

    <style jsx>{`
.blob-bg {
  position: absolute;
  top: 25%;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.wink-computer {
  display: flex;
}
.interactive-blob {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: all 1.5s ease-out;
  transform: scaleX(1) scaleY(1);
}
.hide {
  opacity: 1;
  transform: scaleX(0) scaleY(0);
}
.hero {
  position: relative;
  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 5%);
  .hero-content {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .hero-animation {
    position: relative;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 0;
  }
}
.colorbar-right {
  width: 100%;
  height: 100vh;
  border-right: 0px solid;
  padding-left: 0px; /*184px;*/
}
.colorbar-right.reverse {
  padding-right: 6rem;
}
.colorbar-right.secondEl {
  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.5) 90%);
}
.colorbar-right.heading {
  padding-left: 0px;
}

.img {
  .photo-frame {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    margin-top: 0;
    @apply shadow-xl;
    .photo {
      position: relative;
      width: 100%;
      height: 100vh;
    }
  }
}
.half.desc {
  display: flex;
  justify-content: center;
  align-items: center;
  h1, p {
    border-radius: 24px;
    position: relative;
    z-index: 10;
    color: #012021;
    text-align: left;
  }
  h1 {
    font-size: 3rem;
    color: #012021;
    background: #ffffffcc url('/dot.svg') repeat fixed;
    background-size: 16px 16px;
    padding: 2rem;
    margin: 0;
    z-index: 10;
    @apply shadow-md;
  }
  p {
    font-size: 1.15rem;
    color: #012021;
    background: #ffffffdd;
    padding: 2rem;
    padding-top: 4rem;
    margin: 0;
    margin-left: 1rem;
    margin-top: -2rem;
    z-index: 0;
    @apply shadow-xl;
  }
}

.flex-section {
  display: flex;
  height: 100vh;
  width: 100%;
  .content-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    margin-left: auto;
  }
  .half {
    position: relative;
    width: 50%;
    height: 100%;
  }
  .half.desc {
    .blurb {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding: 1.5rem;
    }
  }
  .half.img {
    padding-left: 0px;
    padding-right: 0px;
  }
}

.flex-section.reverse {
  .content-container {
    justify-content: flex-start;
    flex-direction: row-reverse;
  }
  .half.desc {
    .blurb {
      align-items: flex-start;
    }
  } 
  .half.img {
    padding-right: 0;
    padding-left: 0;
  }
}
    `}</style>
  </>)
}
