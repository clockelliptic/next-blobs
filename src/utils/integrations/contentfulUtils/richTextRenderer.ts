const { BLOCKS, INLINES } = require("@contentful/rich-text-types");
const renderImage = require("./_imageRenderer");
const renderVideo = require("./_videoRenderer");
const renderAudio = require("./_audioRenderer");
const renderHyperlink = require("./_hyperlinkRenderer");

export { contentRenderOptions }

var contentRenderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
      const df = node.data.target.fields,
            type = df.file.contentType;

      if (type.search("image") !== -1) {
        const src = df.file.url,
              alt = df.description,
              dimensions = df.file.details.image;
        return renderImage(src, alt, dimensions, node)
      }

      if (type.search("video") !== -1) {
        return renderAudio(df.file.url)
      }
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const uri = node.data.uri;
      const isShareLink = uri.includes("youtu.be/");
      const isEmbedLink = uri.includes("youtube.com/watch");
      
      if(isEmbedLink || isShareLink) {
        const videoId = isShareLink 
                          ? uri.split("youtu.be/")[1] 
                          : uri.split("?v=")[1].split("&")[0];
        return renderVideo(videoId)
      }

      let text = node.content[0].value;
      return renderHyperlink(uri, text)
    },
  },
}
