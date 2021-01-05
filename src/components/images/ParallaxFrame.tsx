import { Parallax, Background } from 'react-parallax'; 

const ParallaxFrame = ({children}) => (
    <Parallax
        blur={{ min: -15, max: 15 }}
        strength={-128}
        style={{height: '100%', width: '100%'}}
        bgStyle={{height: '140%', width: '140%', top: '0'}}
    >
        <Background>
            { children }
        </Background>
    </Parallax>
);
export default ParallaxFrame;