import Image from 'next/image';

import Menu from './Menu'

const Header = () => {
  return (
    <header id="global-header">
      <div className="inner">
      </div>
      <div className="logo">
        <Image src="/logo.svg" alt="Wink Digital" width={128} height={128} />
      </div>
      <Menu />

      {null /* <style jsx>{`
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
          margin-left: 120px;
          z-index: 50;
        }
      `}</style> */}

    </header>
  )
}

export default Header;