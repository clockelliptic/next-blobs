import { GetServerSideProps } from 'next'
import { useFetchUser } from '@dolly/utils/integrations/auth/user';
import Blobs from '@dolly/components/blobs/Blobs'

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {} // passed to component as props
  }
}

export default function Home(props) {
  const { user, loading } = useFetchUser();
  return (<>
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
    `}</style>
      <style jsx>{`
      .container {
        max-width: 42rem;
        margin: 1.5rem auto;
      }
    `}</style>
    <section className="hero">
      <div className="hero-animation">
        <Blobs />
      </div>
      <div className="hero-content">
        <div className="container">
          <h1>:-)</h1>
        </div>
      </div>
    </section>
  </>)
}
