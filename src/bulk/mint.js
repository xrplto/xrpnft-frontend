import React from 'react';
import axios from 'axios'
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import JSONPretty from 'react-json-pretty';
import isIPFS from 'is-ipfs';
import crypto from 'crypto';

// Material
import { withStyles } from '@mui/styles';
import {
    styled,
    Avatar,
    Button,
    Card,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    IconButton,
    OutlinedInput,
    InputAdornment,
    Link,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import FacebookIcon from '@mui/icons-material/Facebook';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';

// Redux
import { useSelector } from 'react-redux';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, XRPNFT_DOMAIN, TOKEN_FLAGS } from 'src/utils/constants';
import { fIntNumber, fNumber } from 'src/utils/formatNumber';

// Components
import BaseDialog from 'src/components/dialog/BaseDialog';
import NFTokenMintDgContent from './NFTokenMintDgContent';
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
        border_left: 'none'
    }
}));

const MEDIA_TYPES = [
    {
        title: 'Image/png (.png)',
        value: 'png',
        type: 'image',
        icon: (<PhotoLibraryIcon />)
    },
    {
        title: 'Image/jpg (.jpg)',
        value: 'jpg',
        type: 'image',
        icon: (<PhotoLibraryIcon />)
    },
    {
        title: 'Video/mp4 (.mp4)',
        value: 'mp4',
        type: 'video',
        icon: (<VideoLibraryIcon />)
    }
];

const COLLECTION_FAMILIES = [
    {
        title: 'Art',
        value: 'art',
        icon: (<PhotoLibraryIcon />)
    },
    {
        title: 'Social',
        value: 'social',
        icon: (<FacebookIcon />)
    }
];

// Calculate MD5 hash of a large file using javascript
// https://stackoverflow.com/questions/39112096/calculate-md5-hash-of-a-large-file-using-javascript

export default function Minting({bulk}) {
    const fileRef = useRef();
    const infoIPFS = bulk.infoIPFS;
    const BASE_URL = 'https://api.xrpnft.com/api';
    const { accountProfile } = useContext(AppContext);
    const account = accountProfile.account;
    const JWToken = 'JWToken';
    // const levels = useSelector(state => state.status.metadata.levels);
    // const properties = useSelector(state => state.status.metadata.properties);
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar();

    const [nftName, setNftName] = useState('');
    const [imgExt, setImgExt] = useState('png');
    const [extLink, setExtLink] = useState('');
    const [ipfsCID, setIpfsCID] = useState(infoIPFS ? infoIPFS.cid:'');
    const [description, setDescription] = useState('');
    const [collectionName, setCollectionName] = useState('')
    const [collectionFamily, setCollectionFamily] = useState('');
    const [flag, setFlag] = useState(0x0D); // Burnable, /*Only XRP*/, Trustline, Transferable
    const [passphrase, setPassPhrase] = useState('');
    
    const [metadata, setMetaData] = useState([]);
    const [sMeta, setSampleMeta] = useState(null);

    const [jsonFileName, setJsonFileName] = useState(null);
    const [jsonFileModified, setJsonFileModified] = useState(null);

    const [includeTime, setIncludeTime] = useState(false);
    const [oldDateField, setOldDateField] = useState('');
    const [newDateField, setNewDateField] = useState('');

    const [loading, setLoading] = useState(false);

    // Collection related
    const [collections, setCollections] = useState([]);
    const [filter, setFilter] = useState('');

    const [validPassword, setValidPassword] = useState(false);
    
    let canDownload = metadata.length > 0 && nftName && isIPFS.cid(ipfsCID) && collectionName;
    let canCreate = metadata.length > 0 && nftName && isIPFS.cid(ipfsCID) && collectionName && passphrase && validPassword;

    if (includeTime && !newDateField) {
        canDownload = false;
        canCreate = false;
    }

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
        const newMetaData = getFinalMetaData();
        try {
            let res;
            const data = {};
            data.metadata = newMetaData;
            data.flag = flag;
            data.count = newMetaData.length;
            data.bulk = bulk;

            const body = {};
            body.data = data;
            body.account = account;
            body.passphrase = passphrase;
            body.signature = crypto.createHmac("SHA256", JWToken).update(JSON.stringify(data)).digest("hex");

            res = await axios.post(`${BASE_URL}/bulk/mint`, body);

            if (res.status === 200) {
                const ret = res.data;
                if (ret && ret.status && ret.infoMINT) {
                    // console.log(ret);
                    openSnackbar('Bulk mint successful!', 'success')
                    window.location.href = `/bulk`;
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
            const type = pickedFile.type;
            const size = pickedFile.size;
            const lastModified = pickedFile.lastModifiedDate;
            if (type === 'application/json' && size < 20480000) {
                const reader = new FileReader();
                reader.readAsText(pickedFile)
                reader.onloadend = function (e) {
                    let metadata = [];
                    let valid = false;
                    try {
                        metadata = JSON.parse(reader.result);
                        if (metadata.length > 0)
                            valid = true;
                    } catch (e) {
                    }
                    if (!valid) {
                        openSnackbar('Invalid JSON file', 'error');
                    } else {
                        let strDateTime = '';
                        try {
                            if (lastModified) {
                                const dt = new Date(lastModified);
                                const date = dt.toLocaleDateString();
                                const time = dt.toLocaleTimeString();
                                strDateTime = `${date} ${time}`;
                            }
                        } catch (e) {
                            console.error(e);
                        }
                        setJsonFileName(fileName);
                        setMetaData(metadata);
                        setJsonFileModified(strDateTime);

                        const meta = metadata[0];
                        setSampleMeta({...meta});
                        // setNftName(meta.name);
                        // setDescription(meta.description);
                        // setIpfsCID(meta.image);
                    }
                }
            }
        }
    }

    const handleFlagChange = (e) => {
        setFlag(flag ^ e.target.value);
    }

    const handleTimestampCheck = (e) => {
        setIncludeTime(!includeTime);
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
        if (sMeta) {
            const collection = {name: value};
            if (collectionFamily)
                collection.family = collectionFamily;
            sMeta.collection = collection;
        }
    };

    const handleChangeContentType = (event) => {
        const value = event.target.value;
        setImgExt(value);
        if (sMeta) {
            if (value === 'png' || value === 'jpg') {
                sMeta.image = ipfsCID + `/1.${value}`;
                if (sMeta.video) sMeta.video = '';
            } else if (value === 'mp4') {
                sMeta.video = ipfsCID + `/1.${value}`;
                if (sMeta.image) sMeta.image = '';
            }
        }
    };

    const handleChangeCollectionFamily = (event) => {
        const value = event.target.value;
        setCollectionFamily(value);
        if (sMeta) {
            sMeta.collection = {name: collectionName, family: value};
        }
    }

    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType });

        const a = document.createElement("a");
        a.download = fileName;
        a.href = window.URL.createObjectURL(blob);
        const clickEvt = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        a.dispatchEvent(clickEvt);
        a.remove();
    };

    const getFinalMetaData = () => {
        const timestamp = Date.now(); // new Date().getTime();
        let count = 1;
        const newMetaData = [];
        for (var meta of metadata) {
            const newMeta = {...meta};
            newMeta.name = nftName + ' #' + count;
            // TODO

            if (imgExt === 'png' || imgExt === 'jpg') {
                newMeta.image = ipfsCID + `/${count}.${imgExt}`;
                if (newMeta.video) newMeta.video = '';
            } else if (imgExt === 'mp4') {
                newMeta.video = ipfsCID + `/${count}.${imgExt}`;
                if (newMeta.image) newMeta.image = '';
            }

            if (extLink)
                newMeta.external_link = extLink;
                
            if (description)
                newMeta.description = description;

            const collection = {name: collectionName};
            if (collectionFamily)
                collection.family = collectionFamily;
            newMeta.collection = collection;


            if (includeTime && newDateField) {
                if (oldDateField)
                    newMeta[oldDateField] = undefined;
                newMeta[newDateField] = timestamp;
            }

            newMetaData.push(newMeta);
            count++;
        }
        return newMetaData;
    }

    const exportToJson = (e) => {
        e.preventDefault();
        const newMetaData = getFinalMetaData();
        downloadFile({
          data: JSON.stringify(newMetaData),
          fileName: "final_metadata.json",
          fileType: "text/json",
        });
    };

    return (
        <>
        <Stack spacing={2} sx={{mt: 4, mb:3}}>
            <Typography variant="h1a" >Bulk Mint Items</Typography>
            <Typography variant='p3'><Typography variant='s2'>*</Typography> Required fields</Typography>
            <Typography variant='s2'>Please read carefully each fields' description.</Typography>
        </Stack>
        
        <Grid container spacing={3}>
            <Grid item lg={6}>
                <Stack spacing={2} sx={{mb:3}}>
                    <Typography variant='p4'>Metadata <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>File types: JSON. Max size: 20MB</Typography>

                    <Stack direction="row" alignItems='center' spacing={0} sx={{mt: 2}}>
                        <input
                            ref={fileRef}
                            style={{ display: 'none' }}
                            accept='.json'
                            id='contained-button-file1'
                            // multiple
                            type='file'
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant='contained'
                            onClick={() => fileRef.current.click()}
                        >
                            Open
                        </Button>
                        <Stack>
                            <Typography variant='d4' sx={{pl: 3}}>{jsonFileName}</Typography>
                            <Typography variant='p3' sx={{pl: 3}}>{jsonFileModified}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack spacing={2} mb={3}>
                    <Typography variant='p4'>Name <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>
                        {'Indexed numbers will be automatically appended at the end. ex; NAME #1,  NAME #2 ...'}
                    </Typography>
                    <Typography variant='s2'>Don't include indexed numbers like #1</Typography>
                    <TextField required placeholder='Item name' margin='dense'
                        id='id_nft_name'
                        autoComplete='new-password'
                        onChange={(e) => {
                            const value = e.target.value;
                            setNftName(value);
                            if (sMeta) {
                                sMeta.name = value + ' #1';
                            }
                        }}
                        value={nftName}
                        sx={{
                            '&.MuiTextField-root': {
                                marginTop: 0.5
                            }
                        }}
                    />

                    <Typography variant='p4'>Content Media Type <Typography variant='s2'>*</Typography></Typography>
                    <Select
                        value={imgExt}
                        onChange={handleChangeContentType}
                        MenuProps={{ disableScrollLock: true }}
                    >
                        {MEDIA_TYPES.map((type, idx) => (
                            <MenuItem
                                key={idx}
                                value={type.value}
                                sx={{pt:2, pb:2}}
                            >
                                <Stack direction='row' spacing={1} alignItems="center">
                                    {type.icon}
                                    {/* <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${col.logoImage}`} sx={{ mr:2, width: 32, height: 32 }} /> */}
                                    <Typography variant='d4'>{type.title}</Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant='p4'>IPFS CID <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>
                        Your NFTs will refer to this IPFS CID. And postfix indexed numbers will be automatically appended. ex; QmPPPYRX79ESWWoVSB3B1AxtKaE61pDqr8bc9tqV22Cquu/###.png'
                    </Typography>
                    <OutlinedInput required
                        id='id_ipfs_cid'
                        autoComplete='new-password'
                        placeholder='QmPPPYRX79ESWWoVSB3B1AxtKaE61pDqr8bc9tqV22Cquu'
                        margin='dense'
                        variant='outlined'
                        onChange={(e) => {
                            const value = e.target.value;
                            if (isIPFS.multihash(value))
                                console.log(`IS multihash`);

                            setIpfsCID(value)
                            if (sMeta) {
                                if (imgExt === 'png' || imgExt === 'jpg') {
                                    sMeta.image = value + `/1.${imgExt}`;
                                    if (sMeta.video) sMeta.video = '';
                                } else if (imgExt === 'mp4') {
                                    sMeta.video = value + `/1.${imgExt}`;
                                    if (sMeta.image) sMeta.image = '';
                                }
                            }
                        }}
                        value={ipfsCID}
                        endAdornment={
                            <InputAdornment position="end">
                                {isIPFS.cid(ipfsCID) ? <CheckCircleIcon color='success'/> : <ErrorIcon color='error' />}
                            </InputAdornment>
                        }
                        sx={{
                            '&.MuiTextField-root': {
                                marginTop: 1
                            }
                        }}
                    />
                    <Typography variant='p4'>External link</Typography>
                    <Typography variant='p3'>
                        Each NFT metadata will include this link as <Typography variant='s2'>external_link</Typography> field, users can check to learn more about it. You are welcome to link to your own webpage with more details.'
                    </Typography>
                    <TextField required
                        id='id_external_link'
                        autoComplete='new-password'
                        placeholder='External link'
                        margin='dense'
                        onChange={(e) => {
                            const value = e.target.value;
                            setExtLink(value)
                            if (sMeta) {
                                if (value)
                                    sMeta.external_link = value;
                                else
                                    sMeta.external_link = undefined;
                            }
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
                    <Typography variant='p4'>Description <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>
                        {'The description will be included in each item\'s description field.'}
                    </Typography>
                    <Typography variant='s2'>The same description will be applied to all NFTs. Check description field on the right JSON if you have made changes.</Typography>
                    <TextField
                        id='id_text_description'
                        autoComplete='new-password'
                        placeholder='Provide a detailed description of your item'
                        margin='dense'
                        multiline
                        maxRows={4}
                        value={description}
                        onChange={(e) => {
                            const value = e.target.value;
                            setDescription(value)
                            if (sMeta) {
                                sMeta.description = value;
                            }
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
                    <Typography variant='p4'>Flags <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>Flag will be set in your NFTs when minting.</Typography>
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

                <Stack spacing={1} mb={3}>
                    <Typography variant='p4'>Timestamp <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>Check the following checkbox to add the current timestamp value to your metadata.</Typography>
                    <FormGroup sx={{ flexDirection: 'row' }}>
                        <FormControlLabel
                            key='checkbox_timestamp'
                            label='Add Timestamp'
                            value='value'
                            control={
                                <Checkbox checked={includeTime} onChange={handleTimestampCheck} />
                            }
                        />
                    </FormGroup>
                    {includeTime &&
                        <Stack spacing={2} pl={0} alignItems="center" sx={{pl: 4}}>
                            <Stack direction="row" alignItems="center" spacing={3}>
                                {/* <Typography variant='d4'>Remove</Typography> */}
                                <TextField
                                    size="small"
                                    variant="standard"
                                    placeholder='Old Field'
                                    id='id_timestamp_remove_field'
                                    autoComplete='new-password'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (sMeta && value) {
                                            sMeta[value] = undefined;
                                        }
                                        setOldDateField(value);
                                    }}
                                    value={oldDateField}
                                />
                                {/* <Typography variant='d4'>Add</Typography> */}
                                <TextField
                                    size="small"
                                    variant="standard"
                                    placeholder='New Field'
                                    id='id_timestamp_add_field'
                                    autoComplete='new-password'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (sMeta && value) {
                                            if (newDateField)
                                                sMeta[newDateField] = undefined;
                                            sMeta[value] = Date.now();
                                        }
                                        setNewDateField(value);
                                    }}
                                    value={newDateField}
                                />
                            </Stack>
                            <Typography variant='p3'>Old field will be removed from your metadata and the current timestamp will be added with the new field. These fields can be equal if you just want to add the new timestamp value to the existing field. If your metadata does not already have timestamp field, you can ignore Old Field, but the New Field is required, essential.</Typography>
                        </Stack>
                    }
                </Stack>
                
                <Stack spacing={2} mb={0}>
                    <Typography variant='p4'>Collection <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>
                        This is the collection where your item will appear.
                    </Typography>
                    <Select
                        id='select_collection'
                        value={collectionName}
                        onChange={handleChangeCollection}
                        MenuProps={{ disableScrollLock: true }}
                    >
                        <TextField
                            id='textFilter'
                            autoComplete='new-password'
                            autoFocus
                            fullWidth
                            variant='standard'
                            placeholder='Filter'
                            onChange={handleCollectionQuery}
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
                    </Select>
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

                <Stack direction="row" mb={3} alignItems='center' sx={{ minHeight: 60 }}>
                    <Typography variant='d4'>Collection Family</Typography>
                    <FormControl sx={{ ml:2, pt: 0, minWidth: 120 }} size="small">
                        <CustomSelect
                            value={collectionFamily}
                            onChange={handleChangeCollectionFamily}
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
                            setCollectionFamily('');
                            if (sMeta) {
                                if (sMeta.collection)
                                    sMeta.collection.family = undefined;
                            }
                        }}
                        sx={collectionFamily ? { display: 'block' } : { display: 'none' }}
                    >
                        <CancelIcon />
                    </IconButton>
                </Stack>

                <Stack spacing={2} mb={5}>
                    <Typography variant='p4'>Download Your Metadata <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>
                        You can download your final metadata that will be used for minting. We recommend you to check it.
                    </Typography>
                    <Stack direction="row">
                        <Button
                            disabled={!canDownload}
                            variant='contained'
                            startIcon={<DownloadIcon />}
                            onClick={exportToJson}
                        >
                            Download
                        </Button>
                    </Stack>
                </Stack>

                <Stack spacing={2} mb={3}>
                    <Typography variant='p4'>Passphrase <Typography variant='s2'>*</Typography></Typography>

                    <LoadingTextField
                        id='id_bulk_mint_passphrase'
                        type='PASSPHRASE_CREATE_BULK'
                        placeholder='Passphrase'
                        startText=''
                        value={passphrase}
                        setValid={setValidPassword}
                        onChange={(e) => {
                            setPassPhrase(e.target.value)
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

                {/* <BaseDialog
                    isOpen={open}
                    close={() => { setOpen(false) }}
                    title={'Bulk Mint Items'}
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
                /> */}
                <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
            </Grid>
            <Grid item lg={6}>
                <Stack>
                    <Typography variant='p4'>Preview Meta</Typography>
                    <Typography variant='p3' mt={2}>
                        One of your metadata used to create NFT URI. Metadata will follow the <Link href="https://github.com/XRPLF/XRPL-Standards/discussions/69" target="_blank" rel="noreferrer noopener nofollow">XLS-24D</Link> standard.
                    </Typography>
                    {metadata.length > 0 &&
                        <Typography variant='s2' mt={0.5}>(Total {fIntNumber(metadata.length)} metadata in length)</Typography>
                    }
                    <Stack alignItems='center'>
                        <JSONPretty id="json-pretty" data={sMeta || ''} space="4"></JSONPretty>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
        </>
    );
}
