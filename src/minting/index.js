import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import Decimal from 'decimal.js';

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    Button,
    Card,
    CardMedia,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Link,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, TOKEN_FLAGS, CATEGORIES } from 'src/utils/constants';

// Components
import QRDialogNoPush from 'src/components/QRDialogNoPush';
// import PropertySection from './NFTProperties/PropertySection';
// import LevelsSection from './NFTLevels/LevelSection';
// import LoadingTextField from 'src/components/LoadingTextField';
import DlgAddProperty from './DlgAddProperty';

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

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        // border: 'none'
    }
}));

export default function Minting() {
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const user_token = accountProfile?.user_token;

    // const levels = useSelector(state => state.status.metadata.levels);
    // const properties = useSelector(state => state.status.metadata.properties);

    const [open, setOpen] = useState(false);
    const [openAddProperty, setOpenAddProperty] = useState(false);

    const [nftName, setNftName] = useState('');
    const [extLink, setExtLink] = useState('');
    const [description, setDescription] = useState('');
    const [collectionName, setCollectionName] = useState('')
    const [category, setCategory] = useState('NONE');
    const [properties, setProperties] = useState([]);
    const [royalty, setRoyalty] = useState('0');
    const [explicit, setExplicit] = useState(false);
    const [flag, setFlag] = useState(0x08); // Burnable, /*Only XRP*/, Trustline, Transferable
    // const [passphrase, setPassPhrase] = useState('');
    
    const [fileUrl, setFileUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [isVideo, setIsVideo] = useState(false);

    const [openScanQR, setOpenScanQR] = useState(false);
    const [uuidNft, setUuidNft] = useState('null');
    const [uuid, setUuid] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);
    const [nextUrl, setNextUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Collection related
    const [collections, setCollections] = useState([]);
    const [filter, setFilter] = useState('');

    const validAccount = account && accountToken && user_token;
    const canCreate = validAccount && file && nftName && collectionName; //  && passphrase && validPassword;

    const loadCollections=() => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        // https://api.xrpnft.com/api/collection/query?filter=
        axios.get(`${BASE_URL}/collection/query?account=${account}&filter=${filter}`, {headers: {'x-access-token': accountToken}})
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

    useEffect(() => {
        var timer = null;
        var isRunning = false;
        var counter = 150;
        async function getPayload() {
            console.log(counter + " " + isRunning, uuid);
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(`${BASE_URL}/mint/payload/${uuid}/${uuidNft}`);
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    setOpenScanQR(false);
                    if (dispatched_result === 'tesSUCCESS') {
                        // handleClose();
                        openSnackbar('NFTokenMint successful!', 'success');
                        // window.location.href = `/assets/${uuidNft}`;
                        window.location.href = `/congrats/assets/${uuidNft}`;
                    }
                    else {
                        openSnackbar('NFTokenMint failed!', 'error');
                    }

                    return;
                }
            } catch (err) {
                console.error(err);
            }
            isRunning = false;
            counter--;
            if (counter <= 0) {
                openSnackbar('Timeout!', 'error');
                handleScanQRClose();
            }
        }
        if (openScanQR) {
            timer = setInterval(getPayload, 2000);
        }
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        };
    }, [openScanQR, uuid, uuidNft]);

    const onCreateNft = async () => {
        if (!account && !accountToken && !user_token) {
            openSnackbar('Please login', 'error');
            return;
        }

        const num = new Decimal(royalty).toNumber();
        if (num > 50 || num < 0) {
            openSnackbar('Invalid Royalty', 'error');
            return;
        }

        if (num > 0 && ((flag & 0x08) === 0)) {
            openSnackbar('You should select Transferable flag to set Royalty', 'error');
            return;
        }

        // POST https://api.xrpnft.com/api/mint
        setLoading(true);
        try {
            let res;
            const data = {};
            data.name = nftName;
            data.external_link = extLink;
            data.description = description;
            data.collection = collectionName;
            data.category = category;
            data.royalty = royalty;
            data.explicit = explicit;
            data.flag = flag;
            data.isVideo = isVideo;
            if (properties && properties.length > 0)
                data.properties = properties;

            const formdata = new FormData();
            formdata.append('nft', file);
            formdata.append('account', account);
            formdata.append('user_token', user_token);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/mint/one`, formdata, {
                headers: { "Content-Type": "multipart/form-data", 'x-access-token': accountToken }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const uuid_nft = ret.uuid_nft;
                    const uuid = ret.uuid;
                    const qrlink = ret.qrUrl;
                    const nextlink = ret.next;

                    setUuidNft(uuid_nft);
                    setUuid(uuid);
                    setQrUrl(qrlink);
                    setNextUrl(nextlink);
                    setOpenScanQR(true);

                    // openSnackbar('NFT mint successful!', 'success')
                    // window.location.href = `/assets/${uuid_nft}`;
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

    const onDisconnectXumm = async (uuid, uuidNft) => {
        setLoading(true);
        try {
            const res = await axios.delete(`${BASE_URL}/mint/cancel/${uuid}/${uuidNft}`);
            if (res.status === 200) {
                setUuid(null);
                setUuidNft(null);
            }
        } catch(err) {
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
            if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
                const size = pickedFile.size;
                if (size < 10240000) {
                    setFile(pickedFile);
                    // This is used as src of image
                    const reader = new FileReader();
                    reader.readAsDataURL(pickedFile)
                    reader.onloadend = function (e) {
                        setFileUrl(reader.result); // data:image/jpeg;base64
                    }
                } else {
                    openSnackbar('You can only upload images size less than 10MB', 'error');
                    fileRef.current.value = null;
                }
            } else if (ext === 'mp4') {
                const size = pickedFile.size;
                if (size < 102400000) {
                    setFile(pickedFile);
                    setIsVideo(true);
                    // This is used as src of image
                    const reader = new FileReader();
                    reader.readAsDataURL(pickedFile)
                    reader.onloadend = function (e) {
                        setFileUrl(reader.result); // data:image/jpeg;base64
                    }
                } else {
                    openSnackbar('You can only upload video size less than 100MB', 'error');
                    fileRef.current.value = null;
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
        const value = e.target.value;
        if (value === '1')
            setFlag(flag ^ value);
        // if (value !== '8' && value !== '4') // Disable TRANSFERABLE, Trustline flag
        //     setFlag(flag ^ value);
    }

    const handleCollectionQuery = (e) => {
        setCollectionName('');
        setFilter(e.target.value);
    }

    const handleScanQRClose = () => {
        setOpenScanQR(false);
        onDisconnectXumm(uuid, uuidNft);
    };

    const handleChangeCollection = (event) => {
        // const idx = parseInt(event.target.value, 10);
        const value = event.target.value;
        setCollectionName(value);
        setFilter('');
    };

    const handleChangeCategory = (event) => {
        const value = event.target.value;
        setCategory(value);
    }

    const handleChangeRoyalty = (e) => {
        const value = e.target.value;
        try {
            const val = value?value.replace(/[^0-9.]/g, ""):'';
            setRoyalty(val);
        } catch (e) {
        }
    }

    const handleAddProperty = (property) => {
        const {
            name,
            value
        } = property;
        for (var p of properties) {
            if (p.name === name) {
                p.value = value;
                return;
            }
        }
        properties.push(property);
    }

    const handleRemoveProperty = (name) => {
        const newProperties = [];
        for (var p of properties) {
            if (p.name !== name)
                newProperties.push(p);
        }
        setProperties(newProperties);
    }

    return (
        <>
            <DlgAddProperty
                open={openAddProperty}
                setOpen={setOpenAddProperty}
                openSnackbar={openSnackbar}
                onAddProperty={handleAddProperty}
            />

            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a" >Create New Item</Typography>
                <Typography variant='p3'><Typography variant='s2'>*</Typography> Required fields</Typography>
                <Typography variant='p4'>Image, Video, Audio, or 3D Model <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>File types supported: {SUPPORTED_FILE_TYPES.join(', ')}. (Max size: 10MB) MP4 (Max size: 100MB)</Typography>
                <CardWrapper>
                    <input
                        ref={fileRef}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg, .gif, .mp4'
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
                        {/* <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} /> */}

                        <CardMedia
                            component={isVideo?'video':'img'}
                            image={fileUrl}
                            alt={'NFT'}
                            controls={isVideo}
                            style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }}
                        />

                        <ImageIcon fontSize='large' sx={fileUrl ? { display: 'none' } : {width: 100, height: 100}} />
                    </Card>
                </CardWrapper>
            </Stack>
            <Stack spacing={2} mb={3}>
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
                <Typography variant='p4'>Collection <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    This is the collection where your item will appear.
                </Typography>

                <CustomSelect
                    id='select_collection'
                    value={collectionName}
                    onChange={handleChangeCollection}
                    MenuProps={{ disableScrollLock: true }}
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
                            <Stack direction='row' spacing={1} alignItems="center">
                                <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${col.logoImage}`} sx={{ width: 32, height: 32 }} />
                                <Typography variant='d4'>{col.name} <Typography variant='s7'> (Taxon: {col.taxon})</Typography></Typography>
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
                <Typography variant='p4'>Category</Typography>
                <Typography variant='p3'>
                    This helps your NFT to be found when people search by Category.
                </Typography>
                <CustomSelect
                    id='select_category'
                    value={category}
                    onChange={handleChangeCategory}
                    MenuProps={{ disableScrollLock: true }}
                >
                    {CATEGORIES.map((cat, idx) => (
                        <MenuItem
                            key={idx}
                            value={cat.title}
                            sx={{pt:2, pb:2}}
                        >
                            <Stack direction='row' spacing={1} alignItems="center">
                                {cat.icon}
                                <Typography variant='d4'>{cat.title}</Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </CustomSelect>
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Properties</Typography>
                <Typography variant='p3'>
                    You can add more properties in your NFT metadata.
                </Typography>
                {properties.map((property, idx) => (
                    <Stack direction="row" spacing={2} sx={{mt: 3}} key={idx} alignItems="flex-end">
                        <TextField
                            id="outlined-size-name"
                            variant="standard"
                            disabled
                            label={idx===0?"Name":""}
                            value={property.name}
                        />

                        <ArrowRightAltIcon fontSize="small" />

                        <TextField
                            id="outlined-size-value"
                            variant="standard"
                            disabled
                            label={idx===0?"Value":""}
                            value={property.value}
                        />

                        <IconButton onClick={()=>handleRemoveProperty(property.name)}>
                            <HighlightOffOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                ))}
                <Stack direction="row">
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleIcon />}
                        size="small"
                        onClick={()=>setOpenAddProperty(true)}
                    >
                        Add
                    </Button>
                </Stack>
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
                    The description will be included on the item's detail page underneath its image. <Link href="https://www.markdownguide.org/cheat-sheet/">Markdown</Link> syntax is supported.
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
                <Typography variant='p4'>Royalty <Typography variant='s2'>*</Typography><Typography variant='s7'> (Transfer fee)</Typography></Typography>
                <Typography variant='p3'>Between 0.00% and 50.00% in increments of 0.001.</Typography>
                <TextField required placeholder='' margin='dense'
                    onChange={handleChangeRoyalty}
                    value={royalty}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
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
                        <Typography variant='s2'>TrustLine:</Typography> If set, indicates that the issuer wants a trustline to be automatically created. You can't check it.
                    </Typography>
                    <Typography variant='p3'>
                        <Typography variant='s2'>Transferable:</Typography> If set, indicates that this NFT can be transferred. This flag has no effect if the token is being transferred from the issuer or to the issuer. You can't uncheck it.
                    </Typography>
                </Stack>

                <FormGroup sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FormControlLabel
                        key='check_explicit'
                        label='Explicit content'
                        value='explicit'
                        control={
                            <Checkbox checked={explicit} onChange={()=>setExplicit(!explicit)} />
                        }
                    />
                    <Typography variant='p3'>Check if the content is for audiences over 18.</Typography>
                </FormGroup>
                
            </Stack>

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

            <QRDialogNoPush
                open={openScanQR}
                type="NFTokenMint"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}
