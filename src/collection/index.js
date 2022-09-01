import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Button,
    Card,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    IconButton,
    Link,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, XRPNFT_DOMAIN, TOKEN_FLAGS } from 'src/utils/constants';

// Components
import { useSnackbar } from 'src/components/useSnackbar';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 132px;
        height: 132px;
        border: 6px solid ${theme.colors.alpha.black[50]};
        border-radius: 10px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        overflow: hidden;
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 120px;
        height: 120px;
  `
);

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 10px;
  `
);


export default function Collection({data}) {
    // "collection": {
    //     "_id": "6310c27cf81fe46884ef89ba",
    //     "account": "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    //     "name": "collection1",
    //     "slug": "collection-1",
    //     "description": "",
    //     "logoImage": "1662042748001_12e8a38273134f0e87f1039958d5b132.png",
    //     "featuredImage": "1662042748001_70910cc4c6134845bf84cf262e696d05.png",
    //     "bannerImage": "1662042748002_b32b442dea454998aa29ab61c8fa0887.jpg",
    //     "timestamp": 1662042748016,
    //     "creator": "xrpnft.com",
    //     "uuid": "bc80f29343bb43f09f73d8e5e290ee4a"
    // }
    const {
        name,
        slug,
        description,
        logoImage,
        featuredImage,
        bannerImage,
        timestamp
    } = data.collection;

    return (
        <>
            <Stack direction="row" spacing={1.5} sx={{p:3, mt:-6}} alignItems="center">
                <IconCover>
                    <IconWrapper>
                        <IconImage src={`https://s1.xrpnft.com/collection/${logoImage}`}/>
                    </IconWrapper>
                </IconCover>
            </Stack>
            <Stack spacing={1} sx={{mt: 1, mb:3}}>
                <Typography variant="h1a">{name}</Typography>
                <Typography variant="d1">Create, curate, and manage collections of unique NFTs to share and sell.</Typography>
            </Stack>
            <Button component={Link} href="/collection/create" variant="contained" color="primary">
                Create a collection
            </Button>
            <Stack sx={{mt:5, minHeight: '50vh'}}>
            </Stack>
        </>
    );
}
