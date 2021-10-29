import { InferGetStaticPropsType } from 'next'
import Blobs from '../components/blobs/Blobs'
import Blob from '../components/blobs/Interactive/Blob'
import Image from "next/image"  
import { useLayoutEffect, useState } from 'react'
import '../styles/homepage.module.css';

export const getStaticProps = (context) => {
  return {
    props: {

    } // passed to component as props
  }
}

export default function Home({props}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [showInteractiveBlob, setShowInteractiveBlob] = useState(false)

  useLayoutEffect(() => {
    setTimeout(() => setShowInteractiveBlob(true), 11000)
  }, [])

  return (<>
    <section id="homepage-content" style={{minWidth: '100%', minHeight: '100vh'}}>
      <div className="hero-animation" style={{
        minWidth: '100%', minHeight: '100vh', position: 'absolute',
        top: 0, left: 0
      }}>
        <Blobs />
      </div>
      <div className={`interactive-blob${showInteractiveBlob ? '' : ' hide'}`} style={{
        minWidth: '100%', minHeight: '100vh', position: 'absolute',
        top: 0, left: 0, transform: !showInteractiveBlob ? 'scaleX(0) scaleY(0)' : undefined
      }}>  
        <Blob />
      </div>
    </section>
  </>)
}
