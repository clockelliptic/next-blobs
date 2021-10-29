import React from 'react';

import auth0 from '../utils/integrations/auth/auth0';
import { fetchUser } from '../utils/integrations/auth/user';

const Profile = ({ user }) => (<>
    <h1>Profile</h1>

    <div>
      <h3>Profile (server rendered)</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
</>);

Profile.getInitialProps = async ({ req, res }) => {
  if (typeof window === 'undefined') {
    const session = await auth0.getSession(req);
    if (!session || !session.user) {
      res.writeHead(302, {
        Location: '/api/login'
      });
      res.end();
      return;
    }
    return { user: session.user };
  }

  const user = await fetchUser();
  return { user };
};

export default Profile;