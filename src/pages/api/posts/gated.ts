const { getArticles } = require('@dolly/utils/integrations/contentful').public;

export default async function handler(req, res) {
  const session = await auth0.getSession(req);
  const validSession = session && session.user;
  const post = await getPost(req.query.slug, validSession)

  if (post) {
      res.setHeader('Cache-Control', 'max-age=3600');
      res.send({
          status: 'ok',
          data: post
      })
  } else {
      res.send({
          status: 'fail',
          reason: 'Invalid name: article could not be found.'
      })
  }
}

export async function getPost (slug:string, validSession: boolean): Promise<any> {
	const post = (await getArticles({'fields.slug': slug}))[0]
	if (post) {
		let isGated = post.fields.membersOnly;
		// hide gated content from public endpoint
		if (isGated && !validSession) post.fields.content = null;
		return post
	} else {
		return false;
	}
}