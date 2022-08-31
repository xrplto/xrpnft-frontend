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
import XSnackbar from 'src/components/Snackbar';
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

export default function Minting() {
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

    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();
    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [imgExt, setImgExt] = useState('');
    const [loading, setLoading] = useState(false);

    const canCreate = file && nftName;

    const onCreateCollection = async () => {
        return;
        // POST https://api.xrpnft.com/api/mint
        setLoading(true);
        try {
            let res;
            const account = accountProfile.account;

            const data = {};
            data.name = nftName;
            data.externalLink = extLink;
            data.description = description;
            data.collection = collectionName;
            data.flag = flag;

            data.passphrase = passphrase;

            const formdata = new FormData();
            formdata.append('nft', file);
            formdata.append('account', account);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/account/mint`, formdata, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const nft = ret.data;
                    // console.log(ret.link1);
                    // console.log(ret.link2);
                    // console.log(ret.link3);
                    // window.location.href = ret.link;
                    
                    // window.open(ret.link1, '_blank');
                    // window.open(ret.link2, '_blank');
                    // window.open(ret.link3, '_blank');

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
                    window.location.href = `/token/${nft.uuid}`;
                    openSnackbar('NFT mint successful!', 'success')
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
        if (pickedFile) {
            const fileName = pickedFile.name;
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(fileName)[1];
            if (ext)
                ext = ext.toLowerCase();
            if (ext === 'jpg' || ext === 'png') {
                const size = pickedFile.size;
                if (size < 10240000) {
                    setImgExt(ext);
                    setFile(pickedFile);
                    console.log(pickedFile.size);
                    // This is used as src of image
                    const reader = new FileReader();
                    reader.readAsDataURL(pickedFile)
                    reader.onloadend = function (e) {
                        setFileUrl(reader.result); // data:image/jpeg;base64
                    }
                }
            }
        }
    }

    const handleResetFile = (e) => {
        e.stopPropagation()
        setFileUrl(null)
        fileRef.current.value = null
    }

    const handleFlagChange = (e) => {
        setFlag(flag ^ e.target.value);
    }

    const handleCollectionFieldChange = (e) => {
        setCollectionName(e.target.value)
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
                        ref={fileRef}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        multiple
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
                <Typography variant='p4' sx={{pt:2, pb:1}}>Featured image</Typography>
                <Typography variant='p2'>This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of XRPNFT.COM. 600 x 400 recommended.</Typography>
                <CardWrapper>
                    <input
                        ref={fileRef}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        multiple
                        type='file'
                        onChange={handleFileSelect}
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
                            onClick={() => fileRef.current.click()}
                        >
                            <IconButton
                                aria-label='close' onClick={(e) => handleResetFile(e)}
                                sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                            >
                                <CloseIcon color='white' />
                            </IconButton>
                        </CardOverlay>
                        <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                        <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 100, height: 100}} />
                    </Card>
                </CardWrapper>

                <Typography variant='p4' sx={{pt:2, pb:1}}>Banner image</Typography>
                <Typography variant='p2'>This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 350 recommended.</Typography>
                <CardWrapper3>
                    <input
                        ref={fileRef}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg'
                        id='contained-button-file'
                        multiple
                        type='file'
                        onChange={handleFileSelect}
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
                            onClick={() => fileRef.current.click()}
                        >
                            <IconButton
                                aria-label='close' onClick={(e) => handleResetFile(e)}
                                sx={fileUrl ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                            >
                                <CloseIcon color='white' />
                            </IconButton>
                        </CardOverlay>
                        <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                        <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 100, height: 100}} />
                    </Card>
                </CardWrapper3>

                <Typography variant='p4' sx={{pt:2, pb:1}}>Name <Typography variant='s2'>*</Typography></Typography>

                <TextField required placeholder='Example: My XRPL NFTs' margin='dense'
                    onChange={(e) => {
                        setNftName(e.target.value)
                    }}
                    value={nftName}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
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
                        setExtLink(e.target.value)
                    }}
                    value={extLink}
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
