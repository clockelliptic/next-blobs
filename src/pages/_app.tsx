import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../utils/apolloClient";
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (<>
    {null /* <style jsx global>{`
      * {
        box-sizing: border-box;
      }
      .container {
        max-width: 42rem;
        margin: 1.5rem auto;
      }
    `}</style> */}
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  </>)
}

export default MyApp
