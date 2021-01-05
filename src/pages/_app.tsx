import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@dolly/utils/apolloClient";
import { useFetchUser } from '@dolly/utils/integrations/auth/user';
import Layout from '@dolly/components/layouts/Main/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const { user, loading } = useFetchUser();
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (<>
    <style jsx global>{`
      a {
        text-decoration: none;
      }
      a:hover {
        text-decoration: none;
      }

      body, * {
        font-family: "BwModelica";
        box-sizing: border-box;
      }
      .container {
        max-width: 42rem;
        margin: 1.5rem auto;
      }
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Hairline'), local('BwModelica-Hairline'),
             url('/fonts/BwModelica-Hairline.otf') format('truetype');
        font-weight: 100;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Regular Italic'), local('BwModelica-RegularItalic'),
            url('/fonts/BwModelica-RegularItalic.otf') format('truetype');
        font-weight: 500;
        font-style: italic;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Black'), local('BwModelica-Black'),
             url('/fonts/BwModelica-Black.otf') format('truetype');
        font-weight: 900;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica ExtraBold'), local('BwModelica-ExtraBold'),
             url('/fonts/BwModelica-ExtraBold.otf') format('truetype');
        font-weight: 800;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Regular'), local('BwModelica-Regular'),
            url('/fonts/BwModelica-Regular.otf') format('truetype');
        font-weight: 500;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Bold'), local('BwModelica-Bold'),
             url('/fonts/BwModelica-Bold.otf') format('truetype');
        font-weight: bold;
        font-style: normal;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Hairline Italic'), local('BwModelica-HairlineItalic'),
             url('/fonts/BwModelica-HairlineItalic.otf') format('truetype');
        font-weight: 100;
        font-style: italic;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica ExtraBold Italic'), local('BwModelica-ExtraBoldItalic'),
             url('/fonts/BwModelica-ExtraBoldItalic.otf') format('truetype');
        font-weight: 800;
        font-style: italic;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Black Italic'), local('BwModelica-BlackItalic'),
             url('/fonts/BwModelica-BlackItalic.otf') format('truetype');
        font-weight: 900;
        font-style: italic;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Light Italic'), local('BwModelica-LightItalic'),
             url('/fonts/BwModelica-LightItalic.otf') format('truetype');
        font-weight: 300;
        font-style: italic;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Bold Italic'), local('BwModelica-BoldItalic'),
             url('/fonts/BwModelica-BoldItalic.otf') format('truetype');
        font-weight: bold;
        font-style: italic;
      }
      
      @font-face {
        font-family: 'BwModelica';
        src: local('BwModelica Light'), local('BwModelica-Light'),
             url('/fonts/BwModelica-Light.otf') format('truetype');
        font-weight: 300;
        font-style: normal;
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
