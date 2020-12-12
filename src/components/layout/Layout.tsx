import Head from 'next/head';

import Header from './header';
import { Meta } from './Meta'
import { Config } from '@dolly/utils/Config'
import { UserProvider } from '@dolly/utils/integrations/auth/user';

const Layout = ({ user, loading = false, children }) => (
  <UserProvider value={{ user, loading }}>
    <Meta
        title={Config.site_name}
        description={Config.description}
    />
    
    <Header />

    <main>
      <div className="container">{children}</div>
    </main>

    <style jsx>{`
      .container {
        max-width: 42rem;
        margin: 1.5rem auto;
      }
    `}</style>
    <style jsx global>{`
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, 'Segoe UI';
      }
    `}</style>
  </UserProvider>
);

export default Layout;