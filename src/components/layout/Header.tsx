import Link from 'next/link';

import { useUser } from '@dolly/utils/integrations/auth/user';

const Header = () => {
  const { user, loading } = useUser();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href='/'>
              <a>Home (client-rendered)</a>
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
                  <a href='/api/register'>Register</a>
                </li>
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
          color: #fff;
          background-color: #333;
        }
        nav {
          max-width: 42rem;
          margin: 1.5rem auto;
        }
        ul {
          display: flex;
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }
        li {
          margin-right: 1rem;
        }
        li:nth-child(2) {
          margin-right: auto;
        }
        a {
          color: #fff;
          text-decoration: none;
        }
        button {
          font-size: 1rem;
          color: #fff;
          cursor: pointer;
          border: none;
          background: none;
        }
      `}</style>
    </header>
  )
}

export default Header;