import Link from 'next/link';

import { useUser } from '@dolly/utils/integrations/auth/user';

const Header = () => {
  const { user, loading } = useUser();

  return (
    <header id="global-header">
      <nav>
        <h1>:-)</h1>
        <ul>
          <li>
            <Link href='/'>
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href='/posts'>
              <a>Posts</a>
            </Link>
          </li>
          {!loading && (
            user ? (
              <>
                <li>
                  {/* You can use <Link /> here too */}
                  <a href='/profile'>Profile (SSR)</a>
                </li>
                <li>
                  <a href='/api/logout'>Logout</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href='/api/login'>Login</a>
                </li>
              </>
            )
          )}
        </ul>
      </nav>

      <style jsx>{`
        header {
          padding: 0.2rem;
          color: #333;
          background-color: rgba(255,255,255,0.5);
          z-index: 100;
          position: relative;
        }
        h1 {
          font-size: 2rem;
          color: #333;
          margin: 0;
          line-height: 2rem;
        }
        nav {
          display: flex;
          align-items: center;
          padding: 0 32px;
          margin: 1.5rem auto;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
        }
        li {
          margin-left: 2rem;
        }
        a {
          color: #333;
          text-decoration: none;
        }
        button {
          font-size: 1rem;
          color: #333;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}</style>
    </header>
  )
}

export default Header;