import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@dolly/utils/apolloClient";
import { useFetchUser } from '@dolly/utils/integrations/auth/user';
import Layout from '@dolly/components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const { user, loading } = useFetchUser();
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (<>
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }
      .container {
        max-width: 42rem;
        margin: 1.5rem auto;
      }
    `}</style>
    <ApolloProvider client={apolloClient}>
      <Layout user={user} loading={loading}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  </>)
}

export default MyApp
