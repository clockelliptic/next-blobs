import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app'
import { useFetchUser } from '@dolly/utils/integrations/auth/user';
import Layout from '@dolly/components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user} loading={loading}>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
