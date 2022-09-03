import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    Button,
    Card,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
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
import BaseDialog from 'src/components/dialog/BaseDialog';
import NFTokenMintDgContent from './NFTokenMintDgContent';
import CollectionAndProperties from './CollectionAndProperties';
import XSnackbar from 'src/components/Snackbar';
import { useSnackbar } from 'src/components/useSnackbar';
import PropertySection from './NFTProperties/PropertySection';
import LevelsSection from './NFTLevels/LevelSection';

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

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        // border: 'none'
    }
}));

export default function Minting() {
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const account = accountProfile.account;
    const levels = useSelector(state => state.status.metadata.levels);
    const properties = useSelector(state => state.status.metadata.properties);
    const [open, setOpen] = useState(false);
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const [nftName, setNftName] = useState('');
    const [extLink, setExtLink] = useState('');
    const [description, setDescription] = useState('');
    const [collectionName, setCollectionName] = useState('')
    const [flag, setFlag] = useState(0x0D); // Burnable, /*Only XRP*/, Trustline, Transferable
    const [passphrase, setPassPhrase] = useState('');

    
    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Collection related
    const [collections, setCollections] = useState([]);
    const [filter, setFilter] = useState('');

    const canCreate = file && nftName && collectionName && passphrase;

    const loadCollections=() => {
        // https://api.xrpnft.com/api/account/query-collections?filter=
        axios.get(`${BASE_URL}/account/query-collections?account=${account}&filter=${filter}`)
        .then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data;
                    if (ret.collections.length > 0)
                        setCollections(ret.collections);
                }
            } catch (error) {
                console.log(error);
            }
        }).catch(err => {
            console.log("err->>", err);
        }).then(function () {
            // Always executed
        });
    };

    useEffect(() => {
        loadCollections();
    }, [filter, account]);

    const onCreateNft = async () => {
        // POST https://api.xrpnft.com/api/mint
        setLoading(true);
        try {
            let res;
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

    const pinFileToIPFS = async () => {

        // TODO: Called only when the file is uploaded to site.
        setLoading(true)
        if (file) {
            try {
                const formData = new FormData()
                formData.append("file", file)
                console.log('uploading image to ipfs')
                const response = await axios.post(
                    PINATA_PINNING_FILE_URL,
                    formData,
                    {
                        maxContentLength: "Infinity",
                        headers: {
                            "Content-Type": `multipart/form-data;boundary=${formData._boundary}`,
                            'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
                            'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_KEY
                        }
                    }
                )
                // dispatch(setPinnedFileHash(response.data.IpfsHash))
                openSnackbar('IPFSHash: ' + response.data.IpfsHash, 'success')
            } catch (e) {
                console.log(e)
                openSnackbar(e.message, 'error')
            }
        }
        setLoading(false)
    }

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
    }

    const handleResetFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setFileUrl(null);
        fileRef.current.value = null;
    }

    const handleFlagChange = (e) => {
        setFlag(flag ^ e.target.value);
    }

    const handleCollectionQuery = (e) => {
        setCollectionName('');
        setFilter(e.target.value);
    }

    const handleChangeCollection = (event) => {
        // const idx = parseInt(event.target.value, 10);
        const value = event.target.value;
        setCollectionName(value);
        setFilter('');
    };

    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a" >Create New Item</Typography>
                <Typography variant='p3'><Typography variant='s2'>*</Typography> Required fields</Typography>
                <Typography variant='p4'>Image, Video, Audio, or 3D Model <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>File types supported: {SUPPORTED_FILE_TYPES.join(', ')}.   Max size: 10MB</Typography>
                <CardWrapper>
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

                <Typography variant='p4'>Name<Typography variant='s2'>*</Typography></Typography>

                <TextField required placeholder='Item name' margin='dense'
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
                <Typography variant='p4'>External link</Typography>
                <Typography variant='p3'>
                    {'This site will include a link to this URL on this item\'s detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.'}
                </Typography>
                <TextField
                    required placeholder='External link'
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
                <Typography variant='p3'>
                    {'The description will be included on the item\'s detail page underneath its image. Markdown syntax is supported.'}
                </Typography>
                <TextField
                    placeholder='Provide a detailed description of your item'
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
                <Typography variant='p4'>Flags</Typography>
                <FormGroup sx={{ flexDirection: 'row' }}>
                    {
                        TOKEN_FLAGS.map((f) => (
                            <FormControlLabel
                                key={f.value}
                                label={f.label}
                                value={f.value}
                                control={
                                    <Checkbox checked={(flag & f.value) !== 0} onChange={handleFlagChange} />
                                }
                            />
                        ))
                    }
                </FormGroup>
                <Stack spacing={1} pl={0}>
                    <Typography variant='p3'>
                        <Typography variant='s2'>Burnable:</Typography> If set, indicates that the issuer (or an entity authorized by the issuer) can destroy the object. The object's owner can always do so.
                    </Typography>
                    <Typography variant='p3'>
                        <Typography variant='s2'>OnlyXRP:</Typography> If set, nft can only be offered or sold for XRP.
                    </Typography>
                    <Typography variant='p3'>
                        <Typography variant='s2'>TrustLine:</Typography> If set, indicates that the issuer wants a trustline to be automatically created. This is useful when the token can be offered for sale for assets other than XRP and the issuer charges a TransferFee. If this flag is set, a trust line is automatically created as needed to allow the issuer to receive the appropriate transfer fee. If this flag is not set, an attempt to transfer the NFToken for an asset for which the issuer does not have a trustline fails.
                    </Typography>
                    <Typography variant='p3'>
                        <Typography variant='s2'>Transferable:</Typography> If set, indicates that this NFT can be transferred. This flag has no effect if the token is being transferred from the issuer or to the issuer.
                    </Typography>
                </Stack>
            </Stack>
            
            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Collection <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    This is the collection where your item will appear.
                </Typography>
                {/* <Autocomplete
                    id="collection-select"
                    // sx={{ width: 300 }}
                    options={collections}
                    autoHighlight
                    disableClearable
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${option.logoImage}`} sx={{ mr:2, width: 32, height: 32 }} />
                            <Typography variant='d4'>{option.name}</Typography>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label=""
                            placeholder='Select collection'
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                    onInputChange={handleCollectionQuery}
                /> */}
                <CustomSelect
                    id='select_collection'
                    value={collectionName}
                    onChange={handleChangeCollection}
                    // renderValue={(idx) => (
                    //     <>
                    //     {(collections.length > 0 && idx > -1 && collections.length > idx) &&
                    //         <Stack direction='row' alignItems="center">
                    //             <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${collections[idx].logoImage}`} sx={{ mr:2, width: 32, height: 32 }} />
                    //             <Typography variant='d4'>{collections[idx].name}</Typography>
                    //         </Stack>
                    //     }
                    //     </>
                    // )}
                >
                    <TextField
                        id='textFilter'
                        // autoFocus
                        fullWidth
                        variant='standard'
                        placeholder='Filter'
                        onChange={handleCollectionQuery}
                        autoComplete='new-password'
                        value={filter}
                        defaultValue={filter}
                        onFocus={event => {
                            event.target.select();
                        }}
                        sx={{
                            pl:2,pr:2,pb:2,pt:2.5
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                    />
                    {collections.map((col, idx) => (
                        <MenuItem
                            key={col.uuid}
                            value={col.name}
                            sx={{pt:2, pb:2}}
                        >
                            <Stack direction='row' alignItems="center">
                                <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${col.logoImage}`} sx={{ mr:2, width: 32, height: 32 }} />
                                <Typography variant='d4'>{col.name}</Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </CustomSelect>
                {/* <TextField required placeholder='Select collection' margin='dense'
                    onChange={handleCollectionFieldChange}
                    value={collectionName}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
                /> */}
                {/* <PropertySection />
                <LevelsSection /> */}
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
            

            {/* <Button
                variant='contained'
                sx={{ mt: 5, mb: 6 }}
                onClick={() => setOpen(true)}
            >
                Create
            </Button> */}

            <Stack alignItems='right'>
                <LoadingButton
                    disabled={!canCreate}
                    variant='contained'
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<SendIcon />}
                    onClick={onCreateNft}
                    sx={{ mt: 5, mb: 6 }}
                >
                    Create
                </LoadingButton>
            </Stack>

            <BaseDialog
                isOpen={open}
                close={() => { setOpen(false) }}
                title={'Mint New NFT'}
                maxWidth={'sm'}
                render={
                    <NFTokenMintDgContent
                        close={() => { setOpen(false) }}
                        metadata={
                            {
                                image: XRPNFT_DOMAIN + 'pinnedFileHash',
                                name: nftName,
                                type: 'image',
                                description: description,
                                externalLink: extLink,
                                levels: levels,
                                properties: properties,
                            }
                        }
                    />
                }
            />
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    );
}
