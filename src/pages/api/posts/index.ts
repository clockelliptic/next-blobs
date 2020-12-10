const { getArticles } = require('@dolly/utils/integrations/contentful').public;

export default async function handler(req, res) {
  /*
      Paginated.
      Responds with a list of basic preview data for all articles.
  */
  const page = req.query.page,
        perPage = req.query.perPage;

  const articles = await getPosts({
    skip: BigInt(perPage*(page-1)),
    limit: BigInt(perPage)
  })
  
  res.send({
      status: 'ok',
      data: articles
  })
}

export async function getPosts (queryParams: QueryParams): Promise<Array<any>> {
  const posts = await getArticles(queryParams)
  // hide content from previews for all articles
  posts.forEach(article => article.fields.content = null)

  return posts;
}

type QueryParams = {
  skip: bigint,
  limit: bigint
}