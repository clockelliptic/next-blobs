import Header from './Header';
import { Meta } from './Meta'
import { Config } from '../../utils/Config'

const UserProvider = (props: any) => <>{props.children}</>

const Layout = ({ children }) => {
  return (
    <UserProvider>
      <Meta
          title={Config.site_name}
          description={Config.description}
      />
      <main style={{minWidth: '100%', minHeight: '100vh'}}>
        <div>{children}</div>
      </main>

      {null /* <style jsx global>{`
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
      `}</style> */}
 
    </UserProvider>
  );
}
export default Layout;