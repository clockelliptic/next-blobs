import auth0 from '@dolly/utils/integrations/auth/auth0';

export default async function login(req, res) {
  try {
      if (req.query.code && req.query.state) {
        await auth0.handleCallback(req, res, { redirectTo: '/' });
      } else {
        await auth0.handleLogin(req, res);
      }
  } catch(error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}