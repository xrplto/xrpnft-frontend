import React from 'react';
import axios from 'axios'
import { useState, useEffect, useRef } from 'react';
import JSONPretty from 'react-json-pretty';
import isIPFS from 'is-ipfs';
import Decimal from 'decimal.js';
import {filesize} from "filesize";

// Material
import {
    styled, useTheme,
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    OutlinedInput,
    InputAdornment,
    Link,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import { LoadingButton } from '@mui/lab';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SendIcon from '@mui/icons-material/Send';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';

// Loader
import { ClipLoader } from "react-spinners";

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { TOKEN_FLAGS, CATEGORIES } from 'src/utils/constants';
import { fIntNumber, fNumber } from 'src/utils/formatNumber';

// Components
// import LoadingTextField from 'src/components/LoadingTextField';
import WarningMintDialog from './WarningMintDialog';

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        // border: 'none'
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
        title: 'Image/png (.PNG)',
        value: 'PNG',
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
        title: 'Image/jpg (.JPG)',
        value: 'JPG',
        type: 'image',
        icon: (<PhotoLibraryIcon />)
    },
    {
        title: 'Image/jpeg (.jpeg)',
        value: 'jpeg',
        type: 'image',
        icon: (<PhotoLibraryIcon />)
    },
    {
        title: 'Image/jpeg (.JPEG)',
        value: 'JPEG',
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

// Calculate MD5 hash of a large file using javascript
// https://stackoverflow.com/questions/39112096/calculate-md5-hash-of-a-large-file-using-javascript

export default function BulkMint({slug}) {
    const theme = useTheme();
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';    
    
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const minterWallet = accountProfile?.minterWallet;

    // const levels = useSelector(state => state.status.metadata.levels);
    // const properties = useSelector(state => state.status.metadata.properties);
    const [collection, setCollection] = useState(null);

    const [nftName, setNftName] = useState('');
    const [imgExt, setImgExt] = useState('png');
    const [extLink, setExtLink] = useState('');
    const [ipfsCID, setIpfsCID] = useState('');
    const [description, setDescription] = useState('');

    const [category, setCategory] = useState('NONE');
    const [royalty, setRoyalty] = useState('0');
    const [explicit, setExplicit] = useState(false);
    const [issuerChoice, setIssuerChoice] = useState('yes');
    const [updateName, setUpdateName] = useState(true);

    const [flag, setFlag] = useState(0x08); // /*Burnable, Only XRP, Trustline*/, Transferable
    // const [passphrase, setPassPhrase] = useState('');
    
    const [metadata, setMetaData] = useState([]);
    const [sMeta, setSampleMeta] = useState(null);

    const [jsonFiles, setJsonFiles] = useState([]);

    const [includeTime, setIncludeTime] = useState(false);
    const [oldDateField, setOldDateField] = useState('');
    const [newDateField, setNewDateField] = useState('');
    const [minterSet, setMinterSet] = useState(false);

    const [loading, setLoading] = useState(false);

    const [checkingMinter, setCheckingMinter] = useState(false);

    const [ipfsCount, setIpfsCount] = useState(0);

    // const [validPassword, setValidPassword] = useState(false);

    const [openWarning, setOpenWarning] = useState(false);
    
    const active = accountLogin && accountToken && collection;
    let canDownload = active && metadata.length > 0 && isIPFS.cid(ipfsCID);

    if (updateName && !nftName) {
        canDownload = false;
    }

    let canCreate = canDownload; //  && passphrase && validPassword;

    if (issuerChoice === 'yes' && !minterSet) {
        canCreate = false;
    }

    if (includeTime && !newDateField) {
        canDownload = false;
        canCreate = false;
    }

    if (collection && (!collection.infoIPFS || !collection.infoIPFS.cid)) {
        canDownload = false;
        canCreate = false;
    }

    const getCollection = () => {
        if (!slug) {
            openSnackbar('Invalid request!', 'error');
            return;
        }

        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        axios.get(`${BASE_URL}/collection/${slug}?account=${accountLogin}`, {headers: {'x-access-token': accountToken}})
        .then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const coll = res.data.collection;
                    if (coll) {
                        setCollection(coll);
                        if (coll.infoIPFS && coll.infoIPFS.cid) {
                            setIpfsCID(coll.infoIPFS.cid);
                            setIpfsCount(coll.infoIPFS.count);
                        }
                    }
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

    const checkMinter = () => {
        if (!accountLogin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }
        setCheckingMinter(true);
        axios.get(`${BASE_URL}/account/info/${accountLogin}`, {headers: {'x-access-token': accountToken}})
        .then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const data = res.data;
                    const NFTokenMinter = res.data.account_data?.NFTokenMinter;
                    if (minterWallet && NFTokenMinter && minterWallet.address === NFTokenMinter) {
                        setMinterSet(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }).catch(err => {
            console.log("err->>", err);
        }).then(function () {
            // Always executed
            setCheckingMinter(false);
        });
    };

    useEffect(() => {
        getCollection();
    }, [slug]);

    useEffect(() => {
        if (issuerChoice === 'yes') {
            setMinterSet(false);
            checkMinter();
        }
    }, [issuerChoice]);

    const onCreateNft = async () => {
        // POST https://api.xrpnft.com/api/mint
        setLoading(true);
        const newMetaData = getFinalMetaData();
        try {
            if (!newMetaData || newMetaData.length > 100000) {
                openSnackbar('You can not mint NFTs more than 100k', 'error');
                setLoading(false);
                return;
            }

            let res;
            const data = {};
            data.metadata = newMetaData;
            data.flag = flag;
            data.count = newMetaData.length;
            data.collection = collection.name;

            if (issuerChoice === 'yes')
                data.issuer = accountLogin;
            else
                data.issuer = collection.minter;

            data.category = category;
            data.royalty = royalty;
            data.explicit = explicit;

            const body = {};
            body.data = data;
            body.account = accountLogin;

            res = await axios.post(`${BASE_URL}/mint/bulk`, body, {headers: {'x-access-token': accountToken}});

            if (res.status === 200) {
                const ret = res.data;
                if (ret && ret.status && ret.infoMINT) {
                    // console.log(ret);
                    openSnackbar('Bulk mint successful!', 'success')
                    window.location.href = `/bulks`;
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

    const readUploadedFileAsText = (inputFile) => {
        const temporaryFileReader = new FileReader();
      
        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };
        
            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(inputFile);
        });
    };

    const handleFileSelect = async (e) => {
        // TODO
        const files = e.target?.files;
        const newJsonFiles = [];
        const newMetaData = [];
        for (var pickedFile of files) {
            const json = {};
            json.name = pickedFile.name;
            json.type = pickedFile.type;
            json.size = pickedFile.size;
            try {
                const lastModified = pickedFile.lastModifiedDate;
                if (lastModified) {
                    const dt = new Date(lastModified);
                    const date = dt.toLocaleDateString();
                    const time = dt.toLocaleTimeString();
                    json.dateTime = `${date} ${time}`;
                }
            } catch (e) {}

            json.valid = false;
            if (json.type === 'application/json' && json.size < 20480000) {
                try {
                    const fileContents = await readUploadedFileAsText(pickedFile);
                    const metadata = JSON.parse(fileContents);
                    if (metadata.length > 0) {
                        json.valid = true;
                        json.length = metadata.length;
                        for (var m of metadata) {
                            newMetaData.push(m);
                        }
                    }
                } catch (e) {
                }
            }
            newJsonFiles.push(json);
        }
        setMetaData(newMetaData);
        setJsonFiles(newJsonFiles);

        if (newMetaData.length > 0) {
            const meta = newMetaData[0];

            if (imgExt === 'png' || imgExt === 'PNG' || imgExt === 'jpg' || imgExt === 'JPG' || imgExt === 'jpeg' || imgExt === 'JPEG') {
                meta.image = collection.infoIPFS.cid + `/1.${imgExt}`;
                if (meta.video) meta.video = '';
            } else if (imgExt === 'mp4') {
                meta.video = collection.infoIPFS.cid + `/1.${imgExt}`;
                if (meta.image) meta.image = '';
            }

            setSampleMeta({...meta});
        } else {
            setSampleMeta(null);
        }
    }

    const handleFlagChange = (e) => {
        const value = e.target.value;
        if (value === '1')
            setFlag(flag ^ value);
        // if (value !== '8' && value !== '4') // Disable TRANSFERABLE & TRUSTLINE flag unchecking, 
        //     setFlag(flag ^ value);
    }

    const handleTimestampCheck = (e) => {
        setIncludeTime(!includeTime);
    }

    const handleChangeContentType = (event) => {
        const value = event.target.value;
        setImgExt(value);
        if (sMeta) {
            if (value === 'png' || value === 'PNG' || value === 'jpg' || value === 'JPG' || value === 'jpeg' || value === 'JPEG') {
                sMeta.image = ipfsCID + `/1.${value}`;
                if (sMeta.video) sMeta.video = '';
            } else if (value === 'mp4') {
                sMeta.video = ipfsCID + `/1.${value}`;
                if (sMeta.image) sMeta.image = '';
            }
        }
    };

    const handleChangeCategory = (event) => {
        const value = event.target.value;
        setCategory(value);
        if (sMeta) {
            if (!value || value === 'NONE') {
                sMeta.category = undefined;
            } else {
                sMeta.category = value;
            }
        }
    }

    const handleChangeRoyalty = (e) => {
        const value = e.target.value;
        try {
            const val = value?value.replace(/[^0-9.]/g, ""):'0';
            setRoyalty(val);
        } catch (e) {
        }
    }

    const handleChangeIssuerChoice = (event, newValue) => {
        setIssuerChoice(newValue);
    };

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
            if (updateName)
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
            
            if (category && category !== 'NONE')
                newMeta.category = category;

            const metaCollection = {name: collection.name};
            if (collection.family)
                metaCollection.family = collection.family;
            newMeta.collection = metaCollection;

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

    const onCreateNftWithCheck = () => {
        if (!accountLogin || !accountToken) {
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

        if (ipfsCount != metadata.length) {
            setOpenWarning(true);
            setLoading(false);
            return;
        }

        onCreateNft();
    }

    return (
        <>
        <WarningMintDialog open={openWarning} setOpen={setOpenWarning} onContinue={onCreateNft} ipfsCount={ipfsCount} metaLength={metadata.length} />

        <Stack spacing={2} sx={{mt: 4, mb:3}}>
            <Typography variant="h1a" >Bulk Mint Items </Typography>
            <Typography variant='p3'><Typography variant='s2'>*</Typography> Required fields</Typography>
            <Typography variant='s2'>Please read carefully each fields' description and before bulk mint your collection, download your final Metadata and check thoroughly again. Thanks!</Typography>
        </Stack>
        
        <Grid container spacing={3}>
            <Grid item lg={6}>
                <Stack spacing={2} sx={{mb:3}}>
                    <Typography variant='p4'>Metadata <Typography variant='s2'>*</Typography> <Typography variant='s7'> (File types: JSON. Max size: 20MB)</Typography></Typography>

                    <Stack direction="row" alignItems='center' spacing={0} sx={{mt: 2}}>
                        <input
                            ref={fileRef}
                            style={{ display: 'none' }}
                            accept='.json'
                            id='contained-button-file1'
                            multiple
                            type='file'
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant='contained'
                            onClick={() => fileRef.current.click()}
                        >
                            Open
                        </Button>
                    </Stack>
                    <Table stickyHeader sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: "1px solid",
                            borderColor: theme.palette.divider
                        }
                    }}>
                        <TableBody>
                        {jsonFiles.length > 0 && 
                            <TableRow
                                // hover
                                key={"jsonfilelistheader"}
                                sx={{
                                    [`& .${tableCellClasses.root}`]: {
                                        // color: (error ? '#B72136' : '#B72136')
                                    }
                                }}
                            >
                                <TableCell align="left">
                                    <Typography variant="s4">No.</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="s4">Name</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="s4">Size</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="s4">Length</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="s4">Valid</Typography>
                                </TableCell>
                            </TableRow>
                        }
                        {
                            jsonFiles.map((row, idx) => {
                                const {
                                    name,
                                    type,
                                    length,
                                    size,
                                    dateTime,
                                    valid
                                } = row;
                            
                                return (
                                    <TableRow
                                        // hover
                                        key={"jsonfile" + idx}
                                        sx={{
                                            [`& .${tableCellClasses.root}`]: {
                                                // color: (error ? '#B72136' : '#B72136')
                                            }
                                        }}
                                    >
                                        {/* <TableCell align="left"><Typography variant="subtitle2">{id}</Typography></TableCell> */}
                                        <TableCell align="left">
                                            <Typography variant="p5">{idx+1}</Typography>
                                        </TableCell>

                                        <TableCell align="left">
                                            <Stack spacing={0}>
                                                <Typography variant="p5">{name}</Typography>
                                                <Typography variant="s7">{dateTime}</Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="left">
                                            <Typography variant="p5" color="#CB3C1D">{filesize(size, {base: 2, standard: "jedec"})}</Typography>
                                        </TableCell>

                                        <TableCell align="left">
                                            <Typography variant="p5" color="#33C2FF">{length}</Typography>
                                        </TableCell>
                                        
                                        <TableCell align="left">
                                            {valid?
                                                <Tooltip title="Valid JSON file">
                                                    <CheckCircleIcon color="success" />
                                                </Tooltip>
                                                :
                                                <Tooltip title="Invalid JSON file">
                                                    <ErrorIcon color="error" />
                                                </Tooltip>
                                            }
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                        </TableBody>
                    </Table>
                </Stack>
                <Stack spacing={2} mb={3}>
                    <Typography variant='p4'>Collection Info<Typography variant='s2'>*</Typography></Typography>

                    {collection &&
                        <Stack direction="row" alignItems="center">
                            <Avatar alt="C" src={`https://s1.xrpnft.com/collection/${collection.logoImage}`} sx={{mr:2}} />
                            <Typography variant='p4'>{collection.name} <Typography variant='s7'> (Taxon: {collection.taxon})</Typography></Typography>
                        </Stack>
                    }
                    
                    
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant='p4'>NFT Name <Typography variant='s2'>*</Typography></Typography>
                        <FormControlLabel control={<Checkbox checked={updateName} onChange={(e)=>setUpdateName(e.target.checked)}/>}
                            label={<Typography variant='s7'>(Uncheck if you don't want to update name.)</Typography>}
                        />
                    </Stack>

                    <Typography variant='s2'>
                    XRPNFT.com use the lowercase name, not Name. Make sure your metadata contains the lowercase name when you don't update name.
                    </Typography>

                    {updateName &&
                    <>
                        <Typography variant='p3'>
                        {'Indexed numbers will be automatically appended at the end. ex; NAME #1,  NAME #2 ...'}
                        </Typography>
                        <Typography variant='s2'>Don't include indexed numbers like #1</Typography>
                        <TextField required placeholder='Item name' margin='dense'
                            id='id_nft_name'
                            autoComplete='new-password'
                            disabled={!updateName}
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
                    </>
                    }

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

                    <Stack spacing={1} mb={3}>
                        <Typography variant='p4'>NFT issuer <Typography variant='s2'>*</Typography></Typography>
                        <Typography variant='p3'>XRPNFT.com mints NFTs on behalf of your account and implements lazy minting. If you are not sure about this please check <Link target="_blank" rel="noreferrer noopener nofollow" href="https://xrpl.org/nftokenmint.html#issuing-on-behalf-of-another-account">here</Link>.</Typography>
                        <Typography variant='p3'>If you select <Typography variant='s2'>YES</Typography>, you should set the NFTokenMinter account setting of your Account to XRPNFT.com's account in Manage Bulks page.</Typography>
                        <Typography variant='p3'>If you select <Typography variant='s2'>NO</Typography>, XRPNFT.com will mint NFTs with issuer field with its own address.</Typography>

                        <Stack direction="row" spacing={1} alignItems="center">
                            <ToggleButtonGroup
                                color="primary"
                                value={issuerChoice}
                                exclusive
                                size="small"
                                onChange={handleChangeIssuerChoice}
                            >
                                <ToggleButton value="no" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}}>No</ToggleButton>
                                <ToggleButton value="yes" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}}>Yes</ToggleButton>
                            </ToggleButtonGroup>
                            {checkingMinter &&
                                <ClipLoader color='#ff0000' size={15} />
                            }

                            {!checkingMinter && !minterSet && issuerChoice === 'yes' &&
                                <>
                                    <ErrorIcon color='error' />
                                    <Typography variant='s2'>You should set NFTokenMinter on the previous page.</Typography>
                                </>
                            }

                            {!checkingMinter && minterSet && issuerChoice === 'yes' &&
                                <>
                                    <CheckCircleIcon color='success'/>
                                    <Typography variant='s2' color='#33C2FF'>You already set NFTokenMinter.</Typography>
                                </>
                            }
                        </Stack>
                    </Stack>

                    <Typography variant='p4'>Content Media Type <Typography variant='s2'>*</Typography></Typography>
                    <Typography variant='p3'>
                        Please pay attention to image extensions. (Uppercase & Lowercase)
                    </Typography>
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
                        Your NFTs will refer to this IPFS CID. And postfix indexed numbers will be automatically appended.
                    </Typography>
                    <OutlinedInput required
                        id='id_ipfs_cid'
                        autoComplete='new-password'
                        margin='dense'
                        variant='outlined'
                        disabled
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

                {/* <Stack spacing={2} mb={3}>
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
                </Stack> */}
                

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
                        onClick={onCreateNftWithCheck}
                        sx={{ mt: 5, mb: 6 }}
                    >
                        Create
                    </LoadingButton>
                </Stack>
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
