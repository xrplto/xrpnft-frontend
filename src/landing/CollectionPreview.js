import {useEffect, useState} from "react";

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
        {title: 'FAT CATS', src: '/static/collection/fat-cats-xrpl.png', link: 'https://fatcats.nftlabs.to/'},
        {title: 'FRACTALS', src: '/static/collection/fractals.png', link: 'https://fractal.nftlabs.to/'},
        {title: 'LEDGERPUNK', src: '/static/collection/ledgerpunks-nft.png', link: 'https://ledgerpunks.com/'},
        {title: 'RIPPLE SHARKS', src: '/static/collection/Ripple-Sharks.png', link: 'https://nftlabs.to/projects/ripple-sharks/'},
        {title: 'LLAMMAPALOOZA', src: '/static/collection/llamapalooza-xrplnft.png', link: 'https://llamapalooza.nftlabs.to/'},
        {title: 'TRIPPY APES CLUB', src: '/static/collection/TRIPPY.png', link: 'https://trippyapes.nftlabs.to/'},
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setIdx((idx) => (idx + 1) % 6);
        }, 5000);

        return () => clearInterval(slideInterval);

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
