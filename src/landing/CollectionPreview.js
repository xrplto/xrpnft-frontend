import {useEffect, useState} from "react";
import Image from 'next/image';

// Material
import {
    alpha, styled, useTheme, useMediaQuery,
    Box,
    Card,
    Link,
    Stack,
    Typography
} from '@mui/material';

// Components
import SlideImage from "./SlideImage";

const AutoCard = styled(Card)(
    ({ theme }) => `
        width: 300px;
        height: 300px;
        align-items: center;
        background: transparent;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 500px;
            height: 500px;
        }
  `
);

export default function ColectionPreview() {
    const [idx, setIdx] = useState(0);

    const images = [
        {title: 'FAT CATS', src: '/static/collection/fat-cats-xrpl.jpg', link: 'https://fatcats.nftlabs.to/'},
        {title: 'FRACTALS', src: '/static/collection/fractals.jpg', link: 'https://fractal.nftlabs.to/'},
        {title: 'LEDGERPUNK', src: '/static/collection/ledgerpunks-nft.jpg', link: 'https://ledgerpunks.com/'},
        {title: 'RIPPLE SHARKS', src: '/static/collection/Ripple-Sharks.jpg', link: 'https://nftlabs.to/projects/ripple-sharks/'},
        {title: 'LLAMMAPALOOZA', src: '/static/collection/llamapalooza-xrplnft.jpg', link: 'https://llamapalooza.nftlabs.to/'},
        {title: 'TRIPPY APES CLUB', src: '/static/collection/TRIPPY.jpg', link: 'https://trippyapes.nftlabs.to/'},
    ];

    // const images = [
    //     {title: 'FAT CATS', src: 'https://s1.xrpnft.com/static/collection/fat-cats-xrpl.jpg', link: 'https://fatcats.nftlabs.to/'},
    //     {title: 'FRACTALS', src: 'https://s1.xrpnft.com/static/collection/fractals.jpg', link: 'https://fractal.nftlabs.to/'},
    //     {title: 'LEDGERPUNK', src: 'https://s1.xrpnft.com/static/collection/ledgerpunks-nft.jpg', link: 'https://ledgerpunks.com/'},
    //     {title: 'RIPPLE SHARKS', src: 'https://s1.xrpnft.com/static/collection/Ripple-Sharks.jpg', link: 'https://nftlabs.to/projects/ripple-sharks/'},
    //     {title: 'LLAMMAPALOOZA', src: 'https://s1.xrpnft.com/static/collection/llamapalooza-xrplnft.jpg', link: 'https://llamapalooza.nftlabs.to/'},
    //     {title: 'TRIPPY APES CLUB', src: 'https://s1.xrpnft.com/static/collection/TRIPPY.jpg', link: 'https://trippyapes.nftlabs.to/'},
    // ];

    // const cacheImages = async (srcArray) => {
    //     const promises = await srcArray.map((src) => {
    //         return new Promise(function (resolve, reject) {
    //             const img = new Image();
            
    //             img.src = src;
    //             img.onload = resolve();
    //             img.onerror = reject();
    //         });
    //     });
        
    //     await Promise.all(promises);
    // };

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setIdx((idx) => (idx + 1) % 6);
        }, 5000);

        // cacheImages(images);

        return () => {clearInterval(slideInterval); console.log('kill timer')}

    }, []);

    const item = images[idx];
    // <Card style={{maxWidth: 500}}> </Card>
    return (
        <Stack alignItems="center" spacing={1}>
            <Link
                underline="none"
                color="inherit"
                target="_blank"
                href={item.link}
                rel="noreferrer noopener"
            >
                <AutoCard>
                    <SlideImage src={item.src} alt="" key={idx}/>
                </AutoCard>
            </Link>
            <Typography variant='h2a'>{item.title}</Typography>
        </Stack>
    )

}
