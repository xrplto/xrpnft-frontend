import { useState, useEffect } from 'react';
import {
    Box,
    Link,
    Stack,
    Typography
} from '@mui/material';

const collections = [
    {
        title: 'FAT CATS',
        img: '/static/collection/fat-cats-xrpl.png',
        link: 'https://fatcats.nftlabs.to/'
    },
    {
        title: 'FRACTALS',
        img: '/static/collection/fractals.png',
        link: 'https://fractal.nftlabs.to/'
    },
    {
        title: 'LEDGERPUNK',
        img: '/static/collection/ledgerpunks-nft.png',
        link: 'https://ledgerpunks.com/'
    },
    {
        title: 'RIPPLE SHARKS',
        img: '/static/collection/Ripple-Sharks.png',
        link: 'https://nftlabs.to/projects/ripple-sharks/'
    },
    {
        title: 'LLAMMAPALOOZA',
        img: '/static/collection/llamapalooza-xrplnft.png',
        link: 'https://llamapalooza.nftlabs.to/'
    },
    {
        title: 'TRIPPY APES CLUB',
        img: '/static/collection/TRIPPY.png',
        link: 'https://trippyapes.nftlabs.to/'
    },

];

export default function CollectionPreview() {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        let pos = 0;
        function updateCollection() {
            pos++;
            if (pos >= 6) pos = 0;
            setIdx(pos);
        }
        
        const timer = setInterval(() => updateCollection(), 4000)

        return () => {
            clearInterval(timer);
        }
    }, []);

    const item = collections[idx];

    return (
        <Link
            underline="none"
            color="inherit"
            target="_blank"
            href={item.link}
            rel="noreferrer noopener"
        >
            <Stack>
                <Box
                    component="img"
                    sx={{ 
                        width: 480,
                        height: 430 }}
                    alt="The house from the offer."
                    src={item.img}
                />
                <Typography variant='h4'>{item.title}</Typography>
            </Stack>
        </Link>
    );
};
