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

export default function NFTPreview({ nft }) {
	const noImg = '/static/nft_no_image.webp'
    const imgUrl = getImgUrl(nft, 480) || noImg;
    const ipfsImgUrl = getImgUrl(nft) || noImg; //getImgUrl(NFTokenID, meta) // TODO: check if all ok as required dfile, size missing
    const isVideo = nft.meta?.video?true:false;

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
                    large={ipfsImgUrl}
                    hideDownload
                    hideZoom
                    onClose={closeLightbox}
                />
            }

        </Card>
    );
}
