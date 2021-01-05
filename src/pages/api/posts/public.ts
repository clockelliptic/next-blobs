import { initializeApollo } from "@dolly/utils/apolloClient"
import { POST_QUERY, GATED_POST_QUERY } from './_queries'

export async function getPost (slug:string): Promise<any> {
	const apolloClient = initializeApollo();
	const r = await apolloClient.query({
		query: POST_QUERY(slug),
	});
	const r_gated = apolloClient.readQuery({
		query: GATED_POST_QUERY(slug)
	});
	const article = r.data.articleCollection.items[0];

	if (article) {
		let isGated = article.membersOnly;
		// hide gated content from public endpoint
		if (isGated) {
			apolloClient.writeQuery({
				query: GATED_POST_QUERY(slug),
				data: { articleCollection: r_gated.articleCollection }
			});
		}
		return { 
            initialApolloState: apolloClient.cache.extract(), 
            gated: article.membersOnly,
            hasContent: !isGated,
            content: !isGated && article
        }
	} else {
		return false;
	}
}

export default async function handler(req, res) {
  const apolloState = await getPost(req.query.slug)
  if (apolloState) {
      res.setHeader('Cache-Control', 'max-age=3600');
      res.send({
          status: 'ok',
          data: apolloState
      })
  } else {
      res.send({
          status: 'fail',
          reason: 'Invalid name: article could not be found.'
      })
  }
}