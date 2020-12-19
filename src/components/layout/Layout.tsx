import Head from 'next/head';

import Header from './header';
import { Meta } from './Meta'
import { Config } from '@dolly/utils/Config'
import { UserProvider } from '@dolly/utils/integrations/auth/user';
import useTopMarginAdjust from './useTopMarginAdjust';


const Layout = ({ user, loading = false, children }) => {
  const topMarginAdjust = useTopMarginAdjust()
  return (
    <UserProvider value={{ user, loading }}>
      <Meta
          title={Config.site_name}
          description={Config.description}
      />
      
      <Header />

      <main>
        <div>{children}</div>
      </main>

      <div className="parallax-bars">
        <div className="bar" style={{ height: `200vh`, background: '#FF84B7' }}></div>
        <div className="bar" style={{ height: `300vh`, background: '#00C8CB' }}></div>
        <div className="bar" style={{ height: `400vh`, background: '#FFC627' }}></div>
        <div className="bar" style={{ height: `500vh`, background: '#D44220' }}></div>
        <div className="bar" style={{ height: `600vh`, background: '#286EEB' }}></div>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          color: #333;
          font-family: -apple-system, 'Segoe UI';
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
    </UserProvider>
  );
}
export default Layout;