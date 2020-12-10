const { BLOCKS, INLINES } = require("@contentful/rich-text-types");
const renderImage = require("./_imageRenderer");
const renderVideo = require("./_videoRenderer");
const renderAudio = require("./_audioRenderer");
const renderHyperlink = require("./_hyperlinkRenderer");

module.exports = { contentRenderOptions }

var contentRenderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
      const type = node.data.target.fields.file.contentType
      /*
                Render images
            */
      if (type.search("image") !== -1) {
        const src = node.data.target.fields.file.url,
          alt = node.data.target.fields.description,
          dimensions = node.data.target.fields.file.details.image

        return renderImage(src, alt, dimensions, node)
      }

      /*
                Render images
            */
      if (type.search("video") !== -1) {
        const src = node.data.target.fields.file.url
        return renderAudio(src)
      }
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
      /*
                Render video
            */
      const type = node.data.target.sys.contentType.sys.id
      if (type.search("videos") !== -1) {
        const link = node.data.target.fields.link
        const isShareLink = link.includes("youtu.be/")
        const videoId = isShareLink
          ? link.split("youtu.be/")[1]
          : link.split("?v=")[1].split("&")[0]
        return renderVideo(videoId)
      }
    },
    [INLINES.HYPERLINK]: (node, children) => {
      /*
                Render hyperlinks
                 - specifically to ensure data is prefetched
            */

      let uri = node.data.uri
      let text = node.content[0].value
      return renderHyperlink(uri, text)
    },
  },
}
