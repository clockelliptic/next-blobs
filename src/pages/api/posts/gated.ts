import auth0 from '../../../utils/integrations/auth/auth0'
import { initializeApollo } from "../../../utils/apolloClient"
import { POST_QUERY, GATED_POST_QUERY } from './_queries'

export async function getPost (slug:string, validSession: boolean): Promise<any> {
    const apolloClient = initializeApollo();

    const r = await apolloClient.query({
		query: POST_QUERY(slug),
    });
    
	const r_gated = apolloClient.readQuery({
		query: GATED_POST_QUERY(slug)
    });
    
    const article = r.data.articleCollection.items[0];
    if (article) {
        let isGated = article.membersOnly
        let hasContent = isGated && validSession || !isGated
        let membersOnly = article.membersOnly;
		// hide gated content from public endpoint
		if (!hasContent) {
            apolloClient.writeQuery({
                query: GATED_POST_QUERY(slug),
                data: { articleCollection: r_gated.articleCollection }
            });
		}
		return { 
            initialApolloState: apolloClient.cache.extract(), 
            gated: membersOnly, 
            hasContent, 
            content: hasContent && article
        }
	} else {
        console.log("IS GATED - NO ARTICLE", article)
		return false;
	}
}

export default async function handler(req, res) {
  const session = await auth0.getSession(req);
  const isValidSession = (session && session.user) ? true : false
  console.log(session)
  const apolloState = await getPost(req.query.slug, isValidSession)
  if (apolloState) {
      res.setHeader('Cache-Control', 'max-age=3600');
      res.send({
          status: 'ok',
          content: apolloState.content
      })
  } else {
      res.send({
          status: 'fail',
          reason: 'Invalid name: article could not be found.'
      })
  }
}