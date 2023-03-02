import * as React from 'react';
// import ModalImage from "react-modal-image";
import { Lightbox } from "react-modal-image";
import { useState } from 'react';

// Material
import {
    Card,
    CardMedia,
    Link,
} from '@mui/material';

// Utils
import { getImgUrl } from 'src/utils/parse';

export default function NFTPreview({ NFTokenID, meta, dfile }) {
    const imgUrl = getImgUrl(NFTokenID, meta, dfile, 480);
    const isVideo = meta?.video?true:false;

    // const imgUrl = '/static/test.mp4';
    // const isVideo = true;

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
                    controls={isVideo}
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
