import {animated, config, useSpring} from "react-spring";
import Image from "next/image";

const SlideImage = ({src, alt}) => {

    const spring = useSpring({
        from: {opacity: 0},
        to: {opacity: 1},
        config: config.molasses,
    })

    spring.position = "relative";
    spring.width = "100%";
    spring.height = "100%";

    return(
        <animated.div style={spring}>
            <Image
                src={src}
                alt={alt}
                layout="fill"
                objectFit="cover"
            />
        </animated.div>
    )
}

export default SlideImage