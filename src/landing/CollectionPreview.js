import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

// Material
import {
    alpha, styled, useTheme, useMediaQuery,
    Box,
    Card,
    Link,
    Stack,
    Typography
} from '@mui/material';

/* offset-x | offset-y | blur-radius | spread-radius | color */
// box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
// box-shadow: rgba(100, 100, 111, 0.8) 0px 7px 32px 10px;
// box-shadow: inset 0 -3em 3em rgba(0,0,0,0.5), 0 0 20px 20px rgb(255,255,255, 0.2), 0.3em 0.3em 1em rgba(0,0,0,0.2);
// box-shadow: inset 0.2em 0.2em 0.2em 0 rgba(255,255,255,0.5), inset -0.2em -0.2em 0.2em 0 rgba(0,0,0,0.5);
// box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);
// box-shadow: 0px 5px 20px 1px;
const CustomImage = styled('img')(
    ({ theme }) => `
    border-radius: 1em;
    // padding: 1px;
  `
);

const CustomCarousel = styled(Carousel)(
    ({ theme }) => `
    filter: drop-shadow(16px 16px 10px rgba(0,0,0,0.8));
    // box-shadow: 10px 5px 5px rgba(0,0,0,0.2);
    border-radius: 1em;
    // overflow: visible;
  `
);

export default function ColectionPreview() {
    
    // src: 'https://s1.xrpnft.com/static/collection/fat-cats-xrpl.jpg'
    const images1 = [
        {title: 'Muscle Mutant Club', src: 'NFT_Labs_Images4.png', link: 'https://www.mutantmuscleclub.org/'},
        {title: 'Bored Apes XRP Club', src: 'NFT_Labs_Images2.png', link: 'https://x-apes.com/'},
        {title: 'HOGS', src: 'NFT_Labs_Images3.png', link: 'https://x-apes.com/'},

        {title: 'FAT CATS', src: 'fat-cats-xrpl.jpg', link: 'https://fatcats.nftlabs.to/'},
        {title: 'FRACTALS', src: 'fractals.jpg', link: 'https://fractal.nftlabs.to/'},
        // {title: 'LEDGERPUNK', src: 'ledgerpunks-nft.jpg', link: 'https://ledgerpunks.com/'},
        {title: 'RIPPLE SHARKS', src: 'Ripple-Sharks.jpg', link: 'https://nftlabs.to/projects/ripple-sharks/'},
        {title: 'LLAMMAPALOOZA', src: 'llamapalooza-xrplnft.jpg', link: 'https://llamapalooza.nftlabs.to/'},
        {title: 'TRIPPY APES CLUB', src: 'TRIPPY.jpg', link: 'https://trippyapes.nftlabs.to/'},
    ];

    const images = [
        {title: 'Muscle Mutant Club', src: 'https://s1.xrpnft.com/static/collection/NFT_Labs_Images4.png', link: 'https://www.mutantmuscleclub.org/'},
        {title: 'Bored Apes XRP Club', src: 'https://s1.xrpnft.com/static/collection/NFT_Labs_Images2.png', link: 'https://x-apes.com/'},
        {title: 'HOGS', src: 'https://s1.xrpnft.com/static/collection/NFT_Labs_Images3.png', link: 'https://x-apes.com/'},

        {title: 'FAT CATS', src: 'https://s1.xrpnft.com/static/collection/fat-cats-xrpl.jpg', link: 'https://fatcats.nftlabs.to/'},
        {title: 'FRACTALS', src: 'https://s1.xrpnft.com/static/collection/fractals.jpg', link: 'https://fractal.nftlabs.to/'},
        // {title: 'LEDGERPUNK', src: 'https://s1.xrpnft.com/static/collection/ledgerpunks-nft.jpg', link: 'https://ledgerpunks.com/'},
        {title: 'RIPPLE SHARKS', src: 'https://s1.xrpnft.com/static/collection/Ripple-Sharks.jpg', link: 'https://nftlabs.to/projects/ripple-sharks/'},
        {title: 'LLAMMAPALOOZA', src: 'https://s1.xrpnft.com/static/collection/llamapalooza-xrplnft.jpg', link: 'https://llamapalooza.nftlabs.to/'},
        {title: 'TRIPPY APES CLUB', src: 'https://s1.xrpnft.com/static/collection/TRIPPY.jpg', link: 'https://trippyapes.nftlabs.to/'},
    ];

    const fadeAnimationHandler = (props, state) => {
        const transitionTime = props.transitionTime + 'ms';
        const transitionTimingFunction = 'ease-in-out';
    
        let slideStyle = {
            position: 'absolute',
            display: 'block',
            zIndex: -2,
            minHeight: '100%',
            opacity: 0,
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            transitionTimingFunction: transitionTimingFunction,
            msTransitionTimingFunction: transitionTimingFunction,
            MozTransitionTimingFunction: transitionTimingFunction,
            WebkitTransitionTimingFunction: transitionTimingFunction,
            OTransitionTimingFunction: transitionTimingFunction,
        };
    
        if (!state.swiping) {
            slideStyle = {
                ...slideStyle,
                WebkitTransitionDuration: transitionTime,
                MozTransitionDuration: transitionTime,
                OTransitionDuration: transitionTime,
                transitionDuration: transitionTime,
                msTransitionDuration: transitionTime,
            };
        }
    
        return {
            slideStyle,
            selectedStyle: { ...slideStyle, opacity: 1, zIndex: 2, position: 'relative' },
            prevStyle: { ...slideStyle },
        };
    };

    return (
        <CustomCarousel
            interval={4000}
            transitionTime={2000}
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            infiniteLoop={true}
            showThumbs={false}
            useKeyboardArrows={true}
            autoPlay={true}
            stopOnHover={false}
            swipeable={false}
            // dynamicHeight={true}
            animationHandler={fadeAnimationHandler}
        >
            {images.map((item, idx) => (
                <Stack key={idx} sx={{pr: 1, pb: 1}}>
                    <Link
                        underline="none"
                        color="inherit"
                        target="_blank"
                        href={item.link}
                        rel="noreferrer noopener"
                    >
                        <CustomImage src={item.src} />
                    </Link>
                    <Typography variant='h2a'>{item.title}</Typography>
                </Stack>
            ))}
        </CustomCarousel>
    );
}
