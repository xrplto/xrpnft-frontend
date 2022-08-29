import * as React from 'react';
import {
    Box,
    Card,
    CardHeader,
    CardMedia,
    Divider,
    IconButton,
    Typography
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function NFTPreview({ image, title, favorites }) {
    const imgUrl = `https://ipfs.xrpnft.com/ipfs/${image}`;
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
            <CardMedia
                component='img'
                image={imgUrl}
                alt={'IMAGE'}
            />
        </Card>
    );
}
