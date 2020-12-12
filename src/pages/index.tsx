import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { useFetchUser } from '@dolly/utils/integrations/auth/user';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {} // passed to component as props
  }
}

export default function Home(props) {
  const { user, loading } = useFetchUser();
  return (<>
      <h1>Next.js and Auth0 Example</h1>

      {loading && (
        <p>
          Loading login info...
        </p>
      )}

      {!loading && !user && (
        <>
          <p>
            To test the login click in <i>Login</i>
          </p>
          <p>
            Once you have logged in you should be able to click in <i>Profile</i> and <i>Logout</i>
          </p>
        </>
      )}

      {user && (
        <>
          <h4>Rendered user info on the client</h4>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </>
  )
}
