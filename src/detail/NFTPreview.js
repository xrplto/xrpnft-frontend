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

// Utils
import { getImgUrl } from 'src/utils/parse';

export default function NFTPreview({ meta }) {
    const imgUrl = getImgUrl(meta); // `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
    const isVideo = meta?.video?true:false;

    // const imgUrl = 'https://xrpnft.com/static/test.mp4';
    // const isVideo = 'test.mp4';

    const [open, setOpen] = useState(false);

    const closeLightbox = () => {
        setOpen(false);
    }

    return (
        <Card>
            <Link
                component="button"
                underline="none"
                onClick={() => {
                    if (!isVideo)
                        setOpen(true)
                }}
            >
                <CardMedia
                    component={isVideo?'video':'img'}
                    image={imgUrl}
                    alt={'NFT'}
                    // controls={isVideo}
                    autoPlay={isVideo}
                    loop={isVideo}
                    muted
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

            {open && !isVideo &&
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
