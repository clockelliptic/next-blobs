import Image from 'next/image';

import { useUser } from '@dolly/utils/integrations/auth/user';

import Menu from '../Menu'

const Header = () => {
  const { user, loading } = useUser();

  return (
    <header id="global-header">
      <div className="inner">
      </div>
      <div className="logo">
        <div style={{
          height: '74px', width: '74px', 
          margin: '32px', 
          background: '#286eebff',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '3.5rem', fontFamily: 'BwModelica', color: 'white', fontWeight: '700',
          overflow: 'hidden'
        }}>
          C
        </div>
      </div>
      <Menu buttonColor="#fff" buttonColorOpen="#D8FBF2" />

      <style jsx>{`
        header {
          padding: 0.2rem;
          color: #333;
          background-color: rgba(255,255,255,0);
          z-index: 100;
          position: fixed;
          width: calc(100% - 152px);
          top: 0;
          left: 120px;
        }
        h1 {
          font-size: 2rem;
          color: #333;
          margin: 0;
          line-height: 2rem;
        }
        .inner {
          display: flex;
          align-items: center;
          padding: 0 32px;
          margin: 1.5rem auto;
        }
        .logo {
          position: fixed;
          top: 0; left: 0;
          margin-left: 0px;
          z-index: 50;
        }
      `}</style>
    </header>
  )
}

export default Header;