export const videoRenderer = (videoId: string) => {
    return `
        <div
            style="
                width: 100%;
                display: flex;
                justify-content: center;
                margin: 2rem 0 2rem 0;
            "
        >
            <iframe 
                width="560" height="315" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="
                    accelerometer; 
                    autoplay; 
                    encrypted-media; 
                    gyroscope; 
                    picture-in-picture
                " 
                allowfullscreen>
            </iframe>
        </div>
    `
};
