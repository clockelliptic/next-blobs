export const audioRenderer = (src: string) => {
    return `
        <audio style="width:100%" controls>
            <source src="${src}" type="audio/mp4">
        </audio>
   `
};
