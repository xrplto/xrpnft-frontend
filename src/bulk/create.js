import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { ClipLoader } from "react-spinners";

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Button,
    Card,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    IconButton,
    InputAdornment,
    Link,
    OutlinedInput,
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
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, XRPNFT_DOMAIN, TOKEN_FLAGS } from 'src/utils/constants';

// Components
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import LoadingTextField from 'src/components/LoadingTextField';

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

const CardWrapperCircle = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 50%;
    padding: 5px;
    width: fit-content;
    overflow: hidden;
    &:hover {
        cursor: pointer;
    }
`
);

const CardWrapper3 = styled('div')(
    ({ theme }) => `
    border: dashed 3px;
    border-radius: 5px;
    padding: 5px;
    // width: fit-content;
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

const CardOverlayCircle = styled('div')(
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

export default function CreateCollection() {
    const fileRef = useRef();

    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();
    
    // Opensea
    // {
    //     "collections": {
    //         "create": {
    //             "slug": "nft-labsw-1-slug",
    //             "isCategory": false,
    //             "id": "Q29sbGVjdGlvblR5cGU6MTk3MzA2Mzg="
    //         }
    //     }
    // }
    const [bulkName, setBulkName] = useState('')
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    // Logo image
    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    
    const [passphrase, setPassPhrase] = useState(''); // SHOULD BE REMOVED on deploy

    const [validPassword, setValidPassword] = useState(false);

    const canCreate = file && bulkName && url && passphrase && validPassword;

    const onCreateBulk = async () => {
        // POST https://api.xrpnft.com/api/bulk/create
        setLoading(true);
        try {
            let res;
            const account = accountProfile.account;

            const formdata = new FormData();

            formdata.append('logo', file);
            
            const data = {};
            data.name = bulkName;
            data.url = url;
            data.description = description;
            data.passphrase = passphrase;

            formdata.append('account', account);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/bulk/create`, formdata, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const data = ret.data;
                    console.log(data);
                    /*{
                        "logo": "1662563218674_bfd9a05d3c074db683f1ac1ff0174309.png",
                        "name": "Fat Cat",
                        "url": "https://drive.google.com/file/d/1ssfB16Ep5cWKv905c2T13p3zFDeed0wD/view",
                        "description": "",
                        "account": "rKVd5WtB8ugrxaTDTbJv6pVH7WunmyryLq",
                        "status": 0,
                        "uuid": "b07828e14c9446898377b3f94d557f40",
                        "created": 1662563218710,
                        "_id": "6318b392475c7f1bd653b7d5"
                    } */
                    openSnackbar('Create Bulk successful!', 'success')
                    window.location.href = `/bulk`;
                    // setFile(null);
                } else {
                    // { status: false, data: null, err: 'ERR_URL_SLUG' }
                    const err = ret.err;
                    openSnackbar(err, 'error')
                }
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleFileSelect = (e) => {
        const pickedFile = e.target.files[0];
        if (!pickedFile) return;

        const fileName = pickedFile.name;
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(fileName)[1];
        if (ext)
            ext = ext.toLowerCase();
        if (ext === 'jpg' || ext === 'png') {
            const size = pickedFile.size;
            if (size < 10240000) {
                // setImgExt(ext);
                setFile(pickedFile);

                // This is used as src of image
                const reader = new FileReader();
                reader.readAsDataURL(pickedFile)
                reader.onloadend = function (e) {
                    setFileUrl(reader.result); // data:image/jpeg;base64
                }
            }
        }
    }

    const handleResetFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setFileUrl(null);
        fileRef.current.value = null;
    }

    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a">Create a Bulk</Typography>
                <Typography variant='p2'><Typography variant='s2'>*</Typography> Required fields</Typography>
                <Typography variant='p4' sx={{pt:2, pb:1}}>Logo image <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>This image will also be used for navigation. 350 x 350 recommended.</Typography>
                <CardWrapperCircle>
                    <input
                        ref={fileRef}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        // multiple
                        type='file'
                        onChange={handleFileSelect}
                    />
                    <Card
                        sx={{
                            display: 'flex',
                            width: 140,
                            height: 140,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '50%',
                            position: 'relative'
                        }}
                    >
                        <CardOverlayCircle
                            onClick={() => fileRef.current.click()}
                        >
                            <IconButton
                                aria-label='close' onClick={(e) => handleResetFile(e)}
                                sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                            >
                                <CloseIcon color='white' />
                            </IconButton>
                        </CardOverlayCircle>
                        <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                        <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 64, height: 64}} />
                    </Card>
                </CardWrapperCircle>

                <Typography variant='p4' sx={{pt:2, pb:1}}>Name <Typography variant='s2'>*</Typography></Typography>

                <TextField
                    id='id_bulk_name'
                    placeholder='Example: My XRPL NFTs'
                    value={bulkName}
                    onChange={(e) => {
                        setBulkName(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>URL <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p2'>
                    Paste the Google Drive shared link URL here.
                </Typography>
                <Typography variant='p3'>
                    https://drive.google.com/file/d/1xjA-1bodiMrvSCtdTEMim5x1Cam74bXU/view
                </Typography>

                <TextField
                    id='id_bulk_url'
                    placeholder=''
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                    }}
                />
            </Stack>
            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Description</Typography>
                <Typography variant='p3'>
                    0 of 1000 characters used.
                </Typography>
                <TextField
                    placeholder=''
                    margin='dense'
                    multiline
                    maxRows={4}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1,
                            minHeight: 10
                        },
                        '& .MuiOutlinedInput-root': {
                            height: 100,
                            alignItems: 'start'
                        }
                    }}
                />
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Passphrase <Typography variant='s2'>*</Typography></Typography>

                <LoadingTextField
                    id='id_bulk_passphrase'
                    placeholder='Passphrase'
                    type='PASSPHRASE_CREATE_BULK'
                    startText=''
                    value={passphrase}
                    setValid={setValidPassword}
                    onChange={(e) => {
                        setPassPhrase(e.target.value)
                    }}
                />
            </Stack>

            <Stack alignItems='right'>
                <LoadingButton
                    disabled={!canCreate}
                    variant='contained'
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<SendIcon />}
                    onClick={onCreateBulk}
                    sx={{ mt: 5, mb: 6 }}
                >
                    Create
                </LoadingButton>
            </Stack>

            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    );
}
