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
import CollectionList from './CollectionList';
import { useSnackbar } from 'src/components/useSnackbar';

const CardWrapper = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    width: fit-content;
    &:hover {
        cursor: pointer;
    }
`
);

const CardOverlay = styled('div')(
    ({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    background: black;
    inset: 0;
    opacity: 0;
    z-index: 1;
    transition: opacity 0.5s;
    &:hover {
        opacity: 0.6;
    }
`
);

const DisabledButton = withStyles({
    root: {
        "&.Mui-disabled": {
            pointerEvents: "unset", // allow :hover styles to be triggered
            cursor: "not-allowed", // and custom cursor can be defined without :hover state
        }
    }
})(Button);

export default function Collections({data}) {
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const levels = useSelector(state => state.status.metadata.levels);
    const properties = useSelector(state => state.status.metadata.properties);
    const [open, setOpen] = useState(false);
    const login = useSelector(state => state.status.login);

    const [nftName, setNftName] = useState('');
    const [extLink, setExtLink] = useState('');
    const [description, setDescription] = useState('');
    const [collectionName, setCollectionName] = useState('')
    const [flag, setFlag] = useState(0x0D); // Burnable, /*Only XRP*/, Trustline, Transferable
    const [passphrase, setPassPhrase] = useState('');

    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();
    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [imgExt, setImgExt] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a">My Collections</Typography>
                <Typography variant="d1">Create, curate, and manage collections of unique NFTs to share and sell.</Typography>
            </Stack>
            <Button component={Link} href="/collection/create" variant="contained" color="primary">
                Create a collection
            </Button>
            <Stack sx={{mt:5, minHeight: '50vh'}}>
                <CollectionList data={data}/>
            </Stack>
        </>
    );
}
