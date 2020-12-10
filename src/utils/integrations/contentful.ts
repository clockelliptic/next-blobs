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
  }
}

function __contentfulUtilities() {
  return {
    __getItems: getItems,
    __getItem: getItem
  }
}

function getItems(type: string) {
  return async (params = {}): Promise<Array<any>> => {
    const options = {
      content_type: type,
      ...params,
    }
    try {
      const entries = await client.getEntries(options)
      return entries.items
    } catch (err) {
      console.error("Error.\nParams:", options)
      return []
    }
  }
}

function getItem() {
  return async (contentful_id: string): Promise<any> => {
    try {
      const entry = await client.getEntry(contentful_id)
      return entry
    } catch (err) {
      console.error("[Error] Contentful entry id:", contentful_id)
      return {}
    }
  }
}
