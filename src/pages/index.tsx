import { InferGetStaticPropsType } from 'next'
import { useFetchUser } from '@dolly/utils/integrations/auth/user';
import Blobs from '@dolly/components/blobs/Blobs'

export const getStaticProps = (context) => {
  return {
    props: {

    } // passed to component as props
  }
}

export default function Home({props}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { user, loading } = useFetchUser();

  return (<>
    <section className="hero colorbar-left" style={{ borderColor:'#FFFFFF' }}>
      <div className="hero-animation">
        <Blobs />
      </div>
      <div className="hero-content">
        <div className="container">
          <h1>Welcome.</h1>
        </div>
      </div>
    </section>

    <section className="flex-section colorbar-right" style={{ borderColor:'#FF84B7' }}>

    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#00C8CB' }}>

    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#FFC627' }}>

    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#D44220' }}>

    </section>
    <section className="flex-section colorbar-right" style={{ borderColor:'#286EEB' }}>

    </section>


    <style jsx>{`
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
          width: calc(100% - 24px);
          height: 100vh;
          border-right: 24px solid;
        }
        .flex-section {
          display: flex;
          @apply bg-black;
        }
        @screen lg {

        }
    `}</style>
  </>)
}
