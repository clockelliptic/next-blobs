module.exports = (src) => {
    return `
        <audio style="width:100%" controls>
            <source src="${src}" type="audio/mp4">
        </audio>
   `
}