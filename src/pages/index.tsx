import { InferGetStaticPropsType } from 'next'
import { useFetchUser } from '@dolly/utils/integrations/auth/user';
import Blobs from '@dolly/components/blobs/Blobs'
import Blob from '@dolly/components/blobs/Interactive/Blob'
import Image from "next/image"  
import { useLayoutEffect, useState } from 'react'

export const getStaticProps = (context) => {
  return {
    props: {

    } // passed to component as props
  }
}

export default function Home({props}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { user, loading } = useFetchUser();
  const [showInteractiveBlob, setShowInteractiveBlob] = useState(false)

  useLayoutEffect(() => {
    setTimeout(() => setShowInteractiveBlob(true), 11000)
  }, [])

  return (<>
    <section className="hero colorbar-left" style={{ borderColor:'#FFFFFF' }}>
      <div className="hero-animation">
        <Blobs />
      </div>
      <div className={`interactive-blob${showInteractiveBlob ? '' : ' hide'}`}>  
        <Blob />
        <div className="hero-content">
          <div className="container">
            <div className="wink-computer">
              <Image src={`/wink1.svg`} alt={''} width={140} height={140} />
              <div style={{ width: '200px', height: '140px'}} />
              <Image src={`/wink2.svg`} alt={''} width={140} height={140} />
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

    <section className="flex-section colorbar-right" style={{ borderColor:'#FF84B7' }}>
      <div className="half">
      </div>
    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#00C8CB' }}>
      <div className="half">
        <h2>Title</h2>
        <p>Text content</p>
      </div>
      <div className="half">
        <div className="photo">
          <Image src={"/wink-office.jpg"} alt={""} layout="fill" objectFit="cover" />
        </div>
      </div>
    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#FFC627' }}>
      <div className="half">
        <h2>Title</h2>
        <p>Text content</p>
      </div>
      <div className="half">
        <div className="photo">
          <Image src={"/wink-office.jpg"} alt={""} layout="fill" objectFit="cover" />
        </div>
      </div>
    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#D44220' }}>
      <div className="half">
        <h2>Title</h2>
        <p>Text content</p>
      </div>
      <div className="half">
        <div className="photo">
          <Image src={"/wink-office.jpg"} alt={""} layout="fill" objectFit="cover" />
        </div>
      </div>
    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#286EEB' }}>
      <div className="half">
        <h2>Title</h2>
        <p>Text content</p>
      </div>
      <div className="half">
        <div className="photo">
          <Image src={"/wink-office.jpg"} alt={""} layout="fill" objectFit="cover" />
        </div>
      </div>
    </section>


    <style jsx>{`
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
        }
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
          height: 100%;
          top: 0;
          left: 0;
          z-index: 0;
        }
        h1 {
          font-size: 5rem;
          color: #333;
        }
        section {
          height: 100vh;
          width: 100%;
        }
        .colorbar-right {
          width: 100%;
          height: 100vh;
          border-right: 24px solid;
        }
        .flex-section {
          overflow: hidden;
          display: flex;
        }
        .half {
          padding: 64px;
          padding-right: 128px;
          width: 50%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .photo {
          position: relative;
          width: 100%;
          height: 100%;
        }
    `}</style>
  </>)
}
