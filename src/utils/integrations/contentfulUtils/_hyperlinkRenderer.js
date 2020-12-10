module.exports = (uri, text) => {
  return `
        <a rel="external" href="${uri}">${text}</a>
    `
}
