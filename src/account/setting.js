import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    Button,
    Card,
    Divider,
    FormControl,
    IconButton,
    Link,
    MenuItem,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Utils
import { fNumber } from 'src/utils/formatNumber';
import { COLLECTION_FAMILIES } from 'src/utils/constants';

// Components
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

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        border_left: 'none'
    }
}));

const FILE_UNCHANGED = 0;
const FILE_NEW = 1;
const FILE_REMOVED = 2;

export default function EditCollection({collection}) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    /*{
        "_id": "631167f02cb4cfc85b82b74d",
        "account": "rKVd5WtB8ugrxaTDTbJv6pVH7WunmyryLq",
        "name": "Collection #1",
        "slug": "test-collection-1",
        "description": "",
        "logoImage": "1662085104641_9217e932c909438096b784ecc1697961.png",
        "featuredImage": "1662085104642_07be4b7c8cb04957a9e3a789215be41a.jpg",
        "bannerImage": "1662085104643_b749a733b9a64b1380b99d3870146a06.jpg",
        "timestamp": 1662085104650,
        "creator": "xrpnft.com",
        "uuid": "2985930b78484042973a06cf39238f1c"
    }*/

    const logoImageUrl = collection.logoImage?`https://s1.xrpnft.com/collection/${collection.logoImage}`:null;
    const featuredImageUrl = collection.featuredImage?`https://s1.xrpnft.com/collection/${collection.featuredImage}`:null;
    const bannerImageUrl = collection.bannerImage?`https://s1.xrpnft.com/collection/${collection.bannerImage}`:null;
    const spinnerImageUrl = collection.spinnerImage?`https://s1.xrpnft.com/collection/${collection.spinnerImage}`:null;

    const fileRef1 = useRef();
    const fileRef2 = useRef();
    const fileRef3 = useRef();
    const fileRef4 = useRef();
    
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [loading, setLoading] = useState(false);

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
    const [name, setName] = useState(collection.name);
    const [family, setFamily] = useState('');
    const [slug, setSlug] = useState(collection.slug);
    const [description, setDescription] = useState(collection.description);
    const [type, setType] = useState(collection.type);
    const [privateCollection, setPrivateCollection] = useState(collection.private);
    const [bulkUrl, setBulkUrl] = useState(collection.bulkUrl || '');
    const [costs, setCosts] = useState(collection.costs || []);
    const [taxon, setTaxon] = useState(collection.taxon);

    // Logo image
    const [fileUrl1, setFileUrl1] = useState(logoImageUrl);
    const [file1, setFile1] = useState(null);
    // Featured image
    const [fileUrl2, setFileUrl2] = useState(featuredImageUrl);
    const [file2, setFile2] = useState(null);
    // Banner image
    const [fileUrl3, setFileUrl3] = useState(bannerImageUrl);
    const [file3, setFile3] = useState(null);
    // Spinner GIF image
    const [fileUrl4, setFileUrl4] = useState(spinnerImageUrl);
    const [file4, setFile4] = useState(null);

    const [valid1, setValid1] = useState(false); // Name validation check
    const [valid2, setValid2] = useState(false); // Slug validation check

    const checkChanged = () => {
        if (file1) return true;

        if (file2)
            return true;
        else if (fileUrl2 !== featuredImageUrl)
            return true;

        if (file3)
            return true;
        else if (fileUrl3 !== bannerImageUrl)
            return true;

        if (file4)
            return true;
        else if (fileUrl4 !== spinnerImageUrl)
            return true;

        if (family !== collection.family) return true;
        if (description !== collection.description) return true;

        if (!slug) return false;
        if (slug !== collection.slug) return true;

        if (bulkUrl !== collection.bulkUrl) return true;

        if (privateCollection !== collection.private) return true;

        if (type !== 'normal') {
            if (JSON.stringify(costs) !== JSON.stringify(collection.costs || []))
                return true;
        }
        return false;
    }
    
    let canSaveChanges = (file1 || fileUrl1) && valid2 && checkChanged();

    if (type !== 'normal' && (!bulkUrl || costs.length < 1))
        canSaveChanges = false;

    const getFileFlagArray = () => {
        let flag = [0, 0, 0, 0]; // 0: Not changed 1: New File 2: Removed
        if (file1) {
            flag[0] = FILE_NEW;
        }

        if (file2) {
            flag[1] = FILE_NEW;
        } else if (!fileUrl2) {
            flag[1] = FILE_REMOVED;
        }

        if (file3) {
            flag[2] = FILE_NEW;
        } else if (!fileUrl3) {
            flag[2] = FILE_REMOVED;
        }

        if (file4) {
            flag[3] = FILE_NEW;
        } else if (!fileUrl4) {
            flag[3] = FILE_REMOVED;
        }

        return flag;
    }

    const onEditCollection = async () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        setLoading(true);
        try {
            let res;

            const formdata = new FormData();

            let fileFlag = getFileFlagArray();

            if (fileFlag[0] === FILE_NEW)
                formdata.append('imgCollection', file1);
            if (fileFlag[1] === FILE_NEW)
                formdata.append('imgCollection', file2);
            if (fileFlag[2] === FILE_NEW)
                formdata.append('imgCollection', file3);
            if (fileFlag[3] === FILE_NEW)
                formdata.append('imgCollection', file4);

            const data = {};
            data.name = name;
            data.family = family;
            data.slug = slug;
            data.origSlug = collection.slug;
            data.description = description;
            data.fileFlag = fileFlag;
            data.type = type;
            data.private = privateCollection;
            if (type !== 'normal') {
                data.costs = costs;
                data.bulkUrl = bulkUrl;
            }
            data.uuid = collection.uuid;

            formdata.append('account', account);
            formdata.append('data', JSON.stringify(data));
            
            res = await axios.post(`${BASE_URL}/collection/edit`, formdata, {
                headers: { "Content-Type": "multipart/form-data", 'x-access-token': accountToken }
            });

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const data = ret.collection;
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
                    openSnackbar('Edit collection successful!', 'success')
                    // window.location.href = `/collection/${data.slug}`;
                    window.location.href = `/congrats/editcollection/${data.slug}`;
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
        if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
            const size = pickedFile.size;
            if (size < 10240000) {
                // setImgExt(ext);
                if (idx === 1)
                    setFile1(pickedFile);
                else if (idx === 2)
                    setFile2(pickedFile);
                else if (idx === 3)
                    setFile3(pickedFile);
                else if (idx === 4)
                    setFile4(pickedFile);

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
                    else if (idx === 4)
                        setFileUrl4(reader.result);
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

    const handleFileSelect4 = (e) => {
        const pickedFile = e.target.files[0];
        processFile(pickedFile, 4);
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

    const handleResetFile4 = (e) => {
        e.stopPropagation();
        setFile4(null);
        setFileUrl4(null);
        fileRef4.current.value = null;
    }

    const handleChangeType = (event, newType) => {
        // setType(newType);
        openSnackbar('You can not change Type', 'error');
    };

    const handleChangePrivate = (event, newValue) => {
        setPrivateCollection(newValue);
    };

    const handleChangeFamily = (event) => {
        const value = event.target.value;
        setFamily(value);
    }

    const handleRemoveCost = (md5) => {
        const newCosts = [];
        for (var c of costs) {
            if (c.md5 !== md5)
                newCosts.push(c);
        }
        setCosts(newCosts);
    }

    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a">Edit Profile</Typography>
                <Typography variant='p2'><Typography variant='s2'>*</Typography> Required fields</Typography>
                <Typography variant='p4' sx={{pt:2, pb:1}}>Logo image <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>This image will also be used for navigation. 350 x 350 recommended.</Typography>
                <CardWrapperCircle>
                    <input
                        ref={fileRef1}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept='.png, .jpg, .gif'
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
                        accept='.png, .jpg, .gif'
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
                        accept='.png, .jpg, .gif'
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

                <LoadingTextField
                    id='id_collection_name'
                    placeholder='Example: My XRPL NFTs'
                    type='EDIT_COLLECTION_NAME'
                    uuid={collection.uuid}
                    startText=''
                    value={name}
                    setValid={setValid1}
                    onChange={(e) => {
                        // setName(e.target.value);
                    }}
                    disabled
                />
            </Stack>

            <Stack direction="row" mb={3} alignItems='center' sx={{ minHeight: 60 }}>
                <Typography variant='d4'>Collection Family</Typography>
                <FormControl sx={{ ml:2, pt: 0, minWidth: 120 }} size="small">
                    <CustomSelect
                        value={family}
                        onChange={handleChangeFamily}
                        MenuProps={{ disableScrollLock: true }}
                    >
                        {COLLECTION_FAMILIES.map((family, idx) => (
                            <MenuItem
                                key={idx}
                                value={family.value}
                                sx={{pt:2, pb:2}}
                            >
                                <Stack direction='row' spacing={1} alignItems="center">
                                    {family.icon}
                                    {/* <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${col.logoImage}`} sx={{ mr:2, width: 32, height: 32 }} /> */}
                                    <Typography variant='d4'>{family.title}</Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </CustomSelect>
                </FormControl>

                <IconButton
                    aria-label='cancel' onClick={(e) => {
                        setFamily('');
                    }}
                    sx={family ? { display: 'block' } : { display: 'none' }}
                >
                    <CancelIcon />
                </IconButton>
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>URL</Typography>
                <Typography variant='p2'>
                    Customize your URL on XRPNFT.COM. Must only contain lowercase letters, numbers, and hyphens.
                </Typography>
                <LoadingTextField
                    id='id_collection_slug'
                    placeholder='my-xrpl-nfts'
                    type='EDIT_COLLECTION_SLUG'
                    uuid={collection.uuid}
                    startText='https://xrpnft.com/collection/'
                    value={slug}
                    setValid={setValid2}
                    onChange={(e) => {
                        const value = e.target.value;
                        const newSlug = value?value.replace(/[^a-z0-9-]/g, ""):'';
                        setSlug(newSlug);
                    }}
                />
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Type <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    Select your collection type.
                </Typography>

                <Stack spacing={1} pl={0}>
                    <Typography variant='p3'>
                        <Typography variant='s2'>Normal:</Typography> You can mint NFTs one by one for this collection.
                    </Typography>
                    <Typography variant='p3'>
                        <Typography variant='s2'>Bulk:</Typography> You can upload bulk NFTs and sell with costs. Your IPFS NFT images are public in this mode. (Lazy mint mode)
                    </Typography>
                    <Typography variant='p3'>
                        <Typography variant='s2'>Random:</Typography> You can upload bulk NFTs and sell NFTs randomly one by one with Mints. Mints are bought by costs. (Lazy mint mode)
                    </Typography>
                </Stack>

                <ToggleButtonGroup
                    color="primary"
                    value={type}
                    exclusive
                    size="small"
                    onChange={handleChangeType}
                >
                    <ToggleButton value="normal" sx={{pl:2, pr:2}}>Normal</ToggleButton>
                    <ToggleButton value="bulk" sx={{pl:3, pr:3}}>Bulk</ToggleButton>
                    <ToggleButton value="random" sx={{pl:3, pr:3}}>Random</ToggleButton>
                </ToggleButtonGroup>

                {type !== 'normal' &&
                    <>
                        <Stack spacing={1}>
                            {type === 'bulk'?(
                                <Typography variant='p2'>Costs per NFT <Typography variant='s2'>*</Typography></Typography>
                            ):(
                                <Typography variant='p2'>Costs per Mint <Typography variant='s2'>*</Typography></Typography>
                            )}
                            <Typography variant='p3' sx={{pb: 2}}>You need to add at least 1 currency to create a collection.</Typography>

                            {costs.map((token, idx) => (
                                <Stack spacing={1} sx={{pl: 1, pr:1}} key={token.md5}>
                                    <Stack direction="row" spacing={2} sx={{mt: 0}} alignItems="center" justifyContent="space-between">
                                        <Stack direction='row' alignItems="center">
                                            <Avatar alt="C" src={`https://xrpl.to/static/tokens/${token.md5}.${token.ext}`} sx={{ mr: 2 }} />
                                            <Stack spacing={0.5}>
                                                <Stack direction="row">
                                                    <Typography variant='d4'>{token.name}</Typography>
                                                    <Typography variant='d4' sx={{ml: 2}} noWrap><Icon icon={rippleSolid} width={12} height={12}/> {fNumber(token.exch)}</Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center">
                                                    <Typography variant='p3'>{token.issuer}</Typography>
                                                    {token && token.currency !== 'XRP' &&
                                                        <Link
                                                            underline="none"
                                                            color="inherit"
                                                            target="_blank"
                                                            href={`https://bithomp.com/explorer/${token.issuer}`}
                                                            rel="noreferrer noopener nofollow"
                                                        >
                                                            <Tooltip title="Check on Bithomp">
                                                                <IconButton edge="end" aria-label="bithomp" size="small">
                                                                    <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                    }
                                                </Stack>
                                            </Stack>
                                        </Stack>

                                        <Stack direction='row' spacing={2} alignItems="center">
                                            <Stack direction='row' spacing={1} alignItems="flex-end">
                                                <Typography variant='p4' color="#EB5757">{token.cost}</Typography>
                                                <Typography variant='s2'>{token.name}</Typography>
                                            </Stack>
                                            
                                            <IconButton onClick={()=>handleRemoveCost(token.md5)}>
                                                <HighlightOffOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Stack>
                                    <Divider />
                                </Stack>
                            ))}

                            <Stack direction="row" sx={{pl: 1, pt: 1, pb: 3}}>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddCircleIcon />}
                                    size="small"
                                    onClick={()=>setOpenAddCost(true)}
                                >
                                    Add
                                </Button>
                            </Stack>
                        </Stack>

                        <Stack spacing={2} sx={{pl: 0}}>
                            <Typography variant='p2'>
                                Paste the Google Drive shared link URL here. <Typography variant='s2'>*</Typography>
                            </Typography>
                            <Typography variant='p3'>
                                https://drive.google.com/file/d/1xjA-1bodiMrvSCtdTEMim5x1Cam74bXU/view
                            </Typography>

                            <TextField
                                id='id_bulk_url'
                                disabled
                                placeholder=''
                                value={bulkUrl}
                                onChange={(e) => {
                                    // setBulkUrl(e.target.value);
                                }}
                            />
                        </Stack>

                        {type === 'random' &&
                            <>
                                <Typography variant='p4' sx={{pt:2, pb:1}}>Spinner GIF image</Typography>
                                <Typography variant='p3'>This image will be used for spinning NFTs. 600 x 400 recommended.</Typography>
                                <CardWrapper>
                                    <input
                                        ref={fileRef4}
                                        style={{ display: 'none' }}
                                        accept='.png, .jpg, .gif'
                                        id='contained-button-file4'
                                        // multiple
                                        type='file'
                                        onChange={handleFileSelect4}
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
                                            onClick={() => fileRef4.current.click()}
                                        >
                                            <IconButton
                                                aria-label='close' onClick={(e) => handleResetFile4(e)}
                                                sx={fileUrl4 ? { position: 'absolute', right: '1vw', top: '1vh' } : { display: 'none' }}
                                            >
                                                <CloseIcon color='white' />
                                            </IconButton>
                                        </CardOverlay>
                                        <img src={fileUrl4} alt='' style={fileUrl4 ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} />
                                        <ImageIcon fontSize='large' sx={fileUrl4 ? { display: 'none' } : {width: 100, height: 100}} />
                                    </Card>
                                </CardWrapper>
                            </>
                        }
                    </>
                }
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
                <Typography variant='p4'>Taxon</Typography>
                <Typography variant='p3'>
                    Taxon links NFTs to this collection, NFTs minted for this collection will have this Taxon in their NFTokenID field. Taxon is automatically set.
                </Typography>

                <TextField
                    id='id_collection_taxon'
                    disabled
                    placeholder=''
                    margin='dense'
                    value={taxon}
                />
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant='p4'>Private <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>
                    Make your collection private when you need to upload NFTs or do something private.
                    You can make collection public again after you've done all things.
                </Typography>

                <ToggleButtonGroup
                    color="primary"
                    value={privateCollection}
                    exclusive
                    size="small"
                    onChange={handleChangePrivate}
                >
                    <ToggleButton value="no" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}}>No</ToggleButton>
                    <ToggleButton value="yes" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}}>Yes</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            <Stack alignItems='right'>
                <LoadingButton
                    disabled={!canSaveChanges}
                    variant='contained'
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<SendIcon />}
                    onClick={onEditCollection}
                    sx={{ mt: 5, mb: 6 }}
                >
                    Save Changes
                </LoadingButton>
            </Stack>
        </>
    );
}
