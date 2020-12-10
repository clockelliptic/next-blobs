const { getArticles } = require('../../../utils/integrations/contentful').public;

export default async function handler(req, res) {
  console.log(req)
  const article = await getArticles({'fields.slug': req.query.slug})
  if (article[0]) {
      let isGated = article[0].fields.membersOnly;
      // hide gated content from public endpoint
      if (isGated) {
          article[0].fields.content = null;
      }
      res.setHeader('Cache-Control', 'max-age=3600');
      res.send({
          status: 'ok',
          data: article
      })
  } else {
      res.send({
          status: 'fail',
          reason: 'Invalid name: article could not be found.'
      })
  }
}