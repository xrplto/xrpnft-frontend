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
    const fileRef1 = useRef();
    const fileRef2 = useRef();
    const fileRef3 = useRef();

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
    const [collectionName, setCollectionName] = useState('')
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    // Logo image
    const [fileUrl1, setFileUrl1] = useState(null);
    const [file1, setFile1] = useState(null);
    // Featured image
    const [fileUrl2, setFileUrl2] = useState(null);
    const [file2, setFile2] = useState(null);
    // Banner image
    const [fileUrl3, setFileUrl3] = useState(null);
    const [file3, setFile3] = useState(null);

    const [passphrase, setPassPhrase] = useState(''); // SHOULD BE REMOVED on deploy

    const canCreate = file1 && collectionName && passphrase;

    const [status, setStatus] = useState(0);
    const [data, setData] = useState('');

    const onCreateCollection = async () => {
        // POST https://api.xrpnft.com/api/account/create-collection
        setLoading(true);
        try {
            let res;
            const account = accountProfile.account;

            const formdata = new FormData();

            let fileFlag = [true, false, false];
            formdata.append('imgCollection', file1);
            if (file2) {
                fileFlag[1] = true;
                formdata.append('imgCollection', file2);
            }
            if (file3) {
                fileFlag[2] = true;
                formdata.append('imgCollection', file3);
            }

            const data = {};
            data.name = collectionName;
            data.slug = slug;
            data.description = description;
            data.fileFlag = fileFlag;
            data.passphrase = passphrase;

            formdata.append('account', account);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/account/create-collection`, formdata, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const data = ret.data;
                    /*{
                        "name": "FRACTAL-BBB",
                        "externalLink": "",
                        "description": "",
                        "collection": "",
                        "Flags": 13,
                        "Issuer": "rEBKhngY8izMvRrgGg3Yh5zdiQgHH9cExg",
                        "minter": "xrpnft.com",
                        "image": "QmbUaafMaftkUTt44DVdTaSwgKzf51UWMD4NNNc7Jt4fCf",
                        "URI": "516D656A506E6E6775635A5664723637583937324C313842726A366F317241503842794754796137645259763234",
                        "uuid": "d1dcfe3cac80409793629707de2aafbf",
                        "minted": false,
                        "_id": "6308bc3d7a1dec795f21fc33"
                    } */
                    openSnackbar('Create collection successful!', 'success')
                    window.location.href = `/collection/${data.slug}`;
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

    const processFile = (pickedFile, idx) => {
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
                if (idx === 1)
                    setFile1(pickedFile);
                else if (idx === 2)
                    setFile2(pickedFile);
                else if (idx === 3)
                    setFile3(pickedFile);

                // This is used as src of image
                const reader = new FileReader();
                reader.readAsDataURL(pickedFile)
                reader.onloadend = function (e) {
                    if (idx === 1)
                        setFileUrl1(reader.result); // data:image/jpeg;base64
                    else if (idx === 2)
                        setFileUrl2(reader.result);
                    else if (idx === 3)
                        setFileUrl3(reader.result);
                }
            }
        }
    }

    const handleFileSelect1 = (e) => {
        const pickedFile = e.target.files[0];
        processFile(pickedFile, 1);
    }

    const handleFileSelect2 = (e) => {
        const pickedFile = e.target.files[0];
        processFile(pickedFile, 2);
    }

    const handleFileSelect3 = (e) => {
        const pickedFile = e.target.files[0];
        processFile(pickedFile, 3);
    }

    const handleResetFile1 = (e) => {
        e.stopPropagation();
        setFile1(null);
        setFileUrl1(null);
        fileRef1.current.value = null;
    }

    const handleResetFile2 = (e) => {
        e.stopPropagation();
        setFile2(null);
        setFileUrl2(null);
        fileRef2.current.value = null;
    }

    const handleResetFile3 = (e) => {
        e.stopPropagation();
        setFile3(null);
        setFileUrl3(null);
        fileRef3.current.value = null;
    }

    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a">Create a Collection</Typography>
                <Typography variant='p2'><Typography variant='s2'>*</Typography> Required fields</Typography>
                <Typography variant='p4' sx={{pt:2, pb:1}}>Logo image <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p2'>This image will also be used for navigation. 350 x 350 recommended.</Typography>
                <CardWrapperCircle>
                    <input
                        ref={fileRef1}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        // multiple
                        type='file'
                        onChange={handleFileSelect1}
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
                            onClick={() => fileRef1.current.click()}
                        >
                            <IconButton
                                aria-label='close' onClick={(e) => handleResetFile1(e)}
                                sx={fileUrl1 ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                            >
                                <CloseIcon color='white' />
                            </IconButton>
                        </CardOverlayCircle>
                        <img src={fileUrl1} alt='' style={fileUrl1 ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                        <ImageIcon fontSize='large' sx={fileUrl1 ? { display: 'none' } : {width: 64, height: 64}} />
                    </Card>
                </CardWrapperCircle>
                <Typography variant='p4' sx={{pt:2, pb:1}}>Featured image</Typography>
                <Typography variant='p2'>This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of XRPNFT.COM. 600 x 400 recommended.</Typography>
                <CardWrapper>
                    <input
                        ref={fileRef2}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        // multiple
                        type='file'
                        onChange={handleFileSelect2}
                    />
                    <Card
                        sx={{
                            display: 'flex',
                            width: 320,
                            height: 240,
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                    >
                        <CardOverlay
                            onClick={() => fileRef2.current.click()}
                        >
                            <IconButton
                                aria-label='close' onClick={(e) => handleResetFile2(e)}
                                sx={fileUrl2 ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                            >
                                <CloseIcon color='white' />
                            </IconButton>
                        </CardOverlay>
                        <img src={fileUrl2} alt='' style={fileUrl2 ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                        <ImageIcon fontSize='large' sx={fileUrl2 ? { display: 'none' } : {width: 100, height: 100}} />
                    </Card>
                </CardWrapper>

                <Typography variant='p4' sx={{pt:2, pb:1}}>Banner image</Typography>
                <Typography variant='p2'>This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 350 recommended.</Typography>
                <CardWrapper3>
                    <input
                        ref={fileRef3}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        // multiple
                        type='file'
                        onChange={handleFileSelect3}
                    />
                    <Card
                        sx={{
                            display: 'flex',
                            // maxWidth: 700,
                            height: 200,
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'auto',
                            position: 'relative'
                        }}
                    >
                        <CardOverlay
                            onClick={() => fileRef3.current.click()}
                        >
                            <IconButton
                                aria-label='close' onClick={(e) => handleResetFile3(e)}
                                sx={fileUrl3 ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                            >
                                <CloseIcon color='white' />
                            </IconButton>
                        </CardOverlay>
                        <img src={fileUrl3} alt='' style={fileUrl3 ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                        <ImageIcon fontSize='large' sx={fileUrl3 ? { display: 'none' } : {width: 100, height: 100}} />
                    </Card>
                </CardWrapper3>

                <Typography variant='p4' sx={{pt:2, pb:1}}>Name <Typography variant='s2'>*</Typography></Typography>

                <TextField required placeholder='Example: My XRPL NFTs' margin='dense'
                    onChange={(e) => {
                        setCollectionName(e.target.value)
                    }}
                    value={collectionName}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
                />

                <LoadingTextField
                    id='id_nft_name'
                    placeholder='Example: My XRPL NFTs'
                    margin='dense'
                    onChangeValue={(value) => {
                        setCollectionName(value)
                    }}
                    value={collectionName}
                />
            </Stack>
            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>URL</Typography>
                <Typography variant='p2'>
                    Customize your URL on XRPNFT.COM. Must only contain lowercase letters, numbers, and hyphens.
                </Typography>
                <TextField
                    required placeholder='https://xrpnft.com/collection/my-xrpl-nfts'
                    margin='dense'
                    onChange={(e) => {
                        const value = e.target.value;
                        const newSlug = value?value.replace(/[^a-z0-9-]/g, ""):'';
                        setSlug(newSlug);
                    }}
                    value={slug}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
                />
            </Stack>
            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Description</Typography>
                <Typography variant='p2'>
                    <Link href="https://www.markdownguide.org/cheat-sheet/">Markdown</Link> syntax is supported. 0 of 1000 characters used.
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

                <TextField required placeholder='Passphrase' margin='dense'
                    onChange={(e) => {
                        setPassPhrase(e.target.value)
                    }}
                    value={passphrase}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
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
                    onClick={onCreateCollection}
                    sx={{ mt: 5, mb: 6 }}
                >
                    Create
                </LoadingButton>
            </Stack>

            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    );
}
