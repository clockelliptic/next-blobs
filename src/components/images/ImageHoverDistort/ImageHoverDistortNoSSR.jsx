import dynamic from 'next/dynamic'

const ImageHoverDistortNoSSR = dynamic(() => import('./ImageHoverDistort'), {
    ssr: false
});
export default ImageHoverDistortNoSSR;