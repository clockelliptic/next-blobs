export const hyperlinkrenderer = (url: string, text: string) => {
  return `
        <a rel="external" href="${url}">${text}</a>
    `
};
