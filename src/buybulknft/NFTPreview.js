import * as React from 'react';
// import ModalImage from "react-modal-image";
import { Lightbox } from "react-modal-image";
import { useState } from 'react';

// Material
import {
    Box,
    Card,
    CardHeader,
    CardMedia,
    Divider,
    IconButton,
    Link,
    Typography
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function NFTPreview({ image, title, favorites }) {
    const imgUrl = `https://gateway.xrpnft.com/ipfs/${image}`;

    const [open, setOpen] = useState(false);

    const closeLightbox = () => {
        setOpen(false);
    }

    return (
        <Card>
            <CardHeader
                sx={{ padding: '0 30px' }}
                action={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton aria-label='settings'>
                            <FavoriteBorderIcon />
                        </IconButton>
                        <Typography variant='string'>{favorites}</Typography>
                    </Box>
                }
                subheader={title}
            />
            <Divider />

            <Link
                component="button"
                underline="none"
                onClick={() => setOpen(true)}
            >
                <CardMedia
                    component='img'
                    image={imgUrl}
                    alt={'NFT'}
                />
            </Link>

            {/* <CardMedia
                component={ModalImage}
                small={imgUrl}
                large={imgUrl}
                hideDownload
                hideZoom

                disableScrollLock
                DialogProps={{ disableScrollLock: true }}
            /> */}

            {open &&
                <Lightbox
                    small={imgUrl}
                    large={imgUrl}
                    hideDownload
                    hideZoom
                    onClose={closeLightbox}
                />
            }

        </Card>
    );
}
