import { gql } from 'apollo-boost'

module.exports = {
    public: contentfulUtilities(),
    private: __contentfulUtilities(),
}
  
const contentful = require("contentful")

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

function contentfulUtilities() {
  return {
    getTeammates: getItems("teamMembers"),
    getArticles: getItems("article"),
    getReviews: getItems("reviews"),
    getAdverts: getItems("adSpace"),
    getWorkshops: getItems("workshops"),
  }
}

function __contentfulUtilities() {
  return {
    __getItems: getItems,
    __getItem: getItem
  }
}

function getItems(content_type: string) {
  const getter_curried = async (params = {}): Promise<Array<any>> => {
    const options = { content_type, ...params }
    try {
      return (await client.getEntries(options)).items
    } catch (err) {
      console.error("Error.\nParams:", options)
      return []
    }
  }
  return getter_curried;
}

function getItem() {
  const getter_curried = async (contentful_id: string): Promise<any> => {
    try {
      return (await client.getEntry(contentful_id))
    } catch (err) {
      console.error("[Error] Contentful entry id:", contentful_id)
      return {}
    }
  }
  return getter_curried;
}



export const PUBLIC_POST_QUERY = (slug: string) => gql`
  query {
    articleCollection (
      where: {slug: "${slug}"}
    ) {
      items {
        title
        slug
        publicationDate
        featureImage {
          title
          description
          contentType
          fileName
          size
          url
          width
          height
        }
        content {
          json
        }
        author {
          name
        }
        membersOnly
        excerpt
      } 
    }
  }
`

export const GATED_POST_QUERY = (slug: string) => gql`
query {
	articleCollection (
    where: {slug: "${slug}"}
  ) {
    items {
      title
      slug
      publicationDate
      featureImage {
        title
        description
        contentType
        fileName
        size
        url
        width
        height
      }
      author {
        name
      }
      membersOnly
      excerpt
    } 
  }
}
`