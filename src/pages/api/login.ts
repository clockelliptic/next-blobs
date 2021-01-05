import auth0 from '@dolly/utils/integrations/auth/auth0';
import base64url from "base64url";
import randomBytes from "randombytes"

export default async function login(req, res) {
  try {
      if (req.query.code && req.query.state) {
        const state = base64url.toBuffer(req.query.state || '')
        const sep = state.indexOf('|');
        const redirectTo =
            sep > 0 && state.length - sep - 1 === 32
                ? state.toString('utf8', 0, sep)
                : '/';
        await auth0.handleCallback(req, res, {
            redirectTo,
        });
      } else {
        const redirectUrl = req.query.from.includes('.')  // protect from phishing attempts
                          ? '/' 
                          : (req.query.from || '/');
        const state = Buffer.concat([
            Buffer.from(redirectUrl),
            Buffer.from('|'),
            randomBytes(32)
        ]);
        await auth0.handleLogin(req, res, {
            authParams: {
                state: base64url(state),
            }
        });
      }
  } catch(error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}