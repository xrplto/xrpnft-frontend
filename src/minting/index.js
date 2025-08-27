import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Decimal from 'decimal.js';
import { Client } from 'xrpl';

// Material
import {
    styled,
    Avatar,
    Button,
    Card,
    CardMedia,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
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

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { SUPPORTED_FILE_TYPES, TOKEN_FLAGS } from 'src/utils/constants';

// Components
import QRDialog from 'src/components/QRDialog';
// import PropertySection from './NFTProperties/PropertySection';
// import LevelsSection from './NFTLevels/LevelSection';
// import LoadingTextField from 'src/components/LoadingTextField';
import DlgAddTrait from './DlgAddTrait';
import Trait from './Trait';

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
    '& .MuiOutlinedInput-notchedOutline': {
        // border: 'none'
    }
}));

export default function Minting({ showHeader = true, defaultValues }) {
    const fileRef = useRef();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;
    const user_token = accountProfile?.user_token;

    // const levels = useSelector(state => state.status.metadata.levels);
    // const properties = useSelector(state => state.status.metadata.properties);

    const [open, setOpen] = useState(false);
    const [openAddTrait, setOpenAddTrait] = useState(false);

    const [nftName, setNftName] = useState('');
    const [extLink, setExtLink] = useState('');
    const [description, setDescription] = useState('');
    const [collectionName, setCollectionName] = useState(
        defaultValues?.collectionName
    );
    const [traits, setTraits] = useState([]);
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

    const loadCollections = () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        // https://api.xrpnft.com/api/collection/query?filter=
        axios
            .get(
                `${BASE_URL}/collection/query?account=${account}&filter=${filter}`,
                { headers: { 'x-access-token': accountToken } }
            )
            .then((res) => {
                try {
                    if (res.status === 200 && res.data) {
                        const ret = res.data;
                        if (ret.collections.length > 0)
                            setCollections(ret.collections);
                    }
                } catch (error) {
                    console.log(error);
                }
            })
            .catch((err) => {
                console.log('err->>', err);
            })
            .then(function () {
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
        var dispatchTimer = null;

        async function getDispatchResult() {
            try {
              const ret = await axios.get(`${BASE_URL}/mint/payload/${uuid}/${uuidNft}`);
              const res = ret.data.data.response;
              // const account = res.account;
              const dispatched_result = res.dispatched_result;
      
              console.log('Xumm dispatch result:', dispatched_result); // Log Xumm response
              
              // Check if txid is available and log it
              if (res.txid) {
                console.log('Transaction ID (txid):', res.txid);
              }
              
              return dispatched_result;
            } catch (err) {
              console.error('Error getting dispatch result:', err);
            }
        }

        const startInterval = () => {
            let times = 0;
      
            dispatchTimer = setInterval(async () => {
                const dispatched_result = await getDispatchResult();
                console.log('Xumm interval check result:', dispatched_result); // Log Xumm response
                if (dispatched_result && dispatched_result === 'tesSUCCESS') {
                    openSnackbar('Successful!', 'success');
                    stopInterval();
                    return;
                }
        
              times++;
      
              if (times >= 15) {
                openSnackbar('Rejected!', 'error');
                stopInterval();
                return;
              }
            }, 1200);
          };
    
        // Stop the interval
        const stopInterval = () => {
            clearInterval(dispatchTimer);
            handleScanQRClose();
        };
        
        async function getPayload() {
            if (isRunning) return;
            isRunning = true;
            try {
                const ret = await axios.get(
                    `${BASE_URL}/mint/payload/${uuid}/${uuidNft}`
                );
                const resolved_at = ret.data?.resolved_at;
                const dispatched_result = ret.data?.dispatched_result;
                if (resolved_at) {
                    startInterval();
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
                clearInterval(timer);
            }
        };
    }, [openScanQR, uuid, uuidNft]);

    useEffect(() => {
        let ws;

        if (openScanQR && uuid) {
            ws = new WebSocket(`wss://xumm.app/sign/${uuid}`);

            ws.onopen = () => {
                console.log('WebSocket connection opened');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('WebSocket message received:', data);

                if (data.txid) {
                    console.log('Transaction ID (txid) from WebSocket:', data.txid);
                    getTransactionInfo(data.txid);
                }

                if (data.signed === true) {
                    console.log('Transaction signed successfully');
                    // You might want to trigger some action here, like closing the QR dialog
                    // handleScanQRClose();
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [openScanQR, uuid]);

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

        if (num > 0 && (flag & 0x08) === 0) {
            openSnackbar(
                'You should select Transferable flag to set Royalty',
                'error'
            );
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
            data.royalty = royalty;
            data.explicit = explicit;
            data.flag = flag;
            data.isVideo = isVideo;
            if (traits && traits.length > 0) data.attributes = traits;

            const formdata = new FormData();
            formdata.append('nft', file);
            formdata.append('account', account);
            formdata.append('user_token', user_token);
            formdata.append('data', JSON.stringify(data));

            res = await axios.post(`${BASE_URL}/mint/one`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': accountToken
                }
            });

            console.log('Xumm mint response:', res.data); // Log Xumm response

            if (res.status === 200) {
                const ret = res.data;
                if (ret.status) {
                    const uuid_nft = ret.uuid_nft;
                    const uuid = ret.uuid;
                    const qrlink = ret.qrUrl;
                    const nextlink = ret.next;

                    console.log('Xumm successful mint details:', { uuid_nft, uuid, qrlink, nextlink }); // Log Xumm response details

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
                    console.log('Xumm mint error:', err); // Log Xumm error response
                    openSnackbar(err, 'error');
                }
            }
        } catch (err) {
            console.error('Error creating NFT:', err);
        }
        setLoading(false);
    };

    const onDisconnectXumm = async (uuid, uuidNft) => {
        setLoading(true);
        try {
            const res = await axios.delete(
                `${BASE_URL}/mint/cancel/${uuid}/${uuidNft}`
            );
            console.log('Xumm disconnect response:', res.data); // Log Xumm response
            if (res.status === 200) {
                setUuid(null);
                setUuidNft(null);
            }
        } catch (err) {
            console.error('Error disconnecting Xumm:', err);
        }
        setLoading(false);
    };

    const handleFileSelect = (e) => {
        const pickedFile = e.target.files[0];
        if (pickedFile) {
            const fileName = pickedFile.name;
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(fileName)[1];
            if (ext) ext = ext.toLowerCase();
            if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
                const size = pickedFile.size;
                if (size < 10240000) {
                    setFile(pickedFile);
                    setIsVideo(false);
                    // This is used as src of image
                    const reader = new FileReader();
                    reader.readAsDataURL(pickedFile);
                    reader.onloadend = function (e) {
                        setFileUrl(reader.result); // data:image/jpeg;base64
                    };
                } else {
                    openSnackbar(
                        'You can only upload images size less than 10MB',
                        'error'
                    );
                    fileRef.current.value = null;
                }
            } else if (ext === 'mp4') {
                const size = pickedFile.size;
                if (size < 102400000) {
                    setFile(pickedFile);
                    setIsVideo(true);
                    // This is used as src of image
                    const reader = new FileReader();
                    reader.readAsDataURL(pickedFile);
                    reader.onloadend = function (e) {
                        setFileUrl(reader.result); // data:image/jpeg;base64
                    };
                } else {
                    openSnackbar(
                        'You can only upload video size less than 50MB',
                        'error'
                    );
                    fileRef.current.value = null;
                }
            }
        }
    };

    const handleResetFile = (e) => {
        e.stopPropagation();
        setFile(null);
        setFileUrl(null);
        fileRef.current.value = null;
    };

    const handleFlagChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setFlag(flag ^ value);
    };

    const handleCollectionQuery = (e) => {
        setCollectionName('');
        setFilter(e.target.value);
    };

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

    const handleChangeRoyalty = (e) => {
        const value = e.target.value;
        try {
            const val = value ? value.replace(/[^0-9.]/g, '') : '';
            setRoyalty(val);
        } catch (e) {}
    };

    const onAddTrait = (trait) => {
        const { type, value } = trait;
        for (const t of traits) {
            if (t.type === type) {
                t.value = value;
                return;
            }
        }
        traits.push(trait);
    };

    const handleRemoveTrait = (type) => {
        const newTraits = [];
        for (const t of traits) {
            if (t.type !== type) newTraits.push(t);
        }
        setTraits(newTraits);
    };

    const getTransactionInfo = async (txid) => {
        const client = new Client('wss://s1.ripple.com');
        try {
            await client.connect();
            console.log('Connected to XRPL');

            const tx = await client.request({
                command: 'tx',
                transaction: txid
            });

            console.log('Transaction Information:', JSON.stringify(tx.result, null, 2));
            console.log('Result:', tx.result.meta.TransactionResult);

            if (tx.result.tx_json && tx.result.tx_json.TransactionType === 'NFTokenMint') {
                console.log('NFTokenTaxon:', tx.result.tx_json.NFTokenTaxon);
                console.log('URI:', tx.result.tx_json.URI);
            }

            let nfTokenID = null;
            if (tx.result.meta && tx.result.meta.nftoken_id) {
                nfTokenID = tx.result.meta.nftoken_id;
                console.log('NFToken ID:', nfTokenID);
                
                // Redirect to the congrats page with the NFToken ID
                window.location.href = `/congrats/${nfTokenID}`;
            } else {
                console.log('NFToken ID not found in transaction metadata');
            }

        } catch (error) {
            console.error('Error fetching transaction info:', error);
        } finally {
            client.disconnect();
        }
    };

    return (
        <>
            <DlgAddTrait
                open={openAddTrait}
                setOpen={setOpenAddTrait}
                openSnackbar={openSnackbar}
                onAddTrait={onAddTrait}
            />

            <Stack spacing={1} sx={{ mt: 4, mb: 3 }}>
                {showHeader && (
                    <Typography variant="h1a">Create New NFT</Typography>
                )}
                <Typography variant="p3">
                    <Typography variant="s2">*</Typography> Required fields
                </Typography>
                <Typography variant="p4">
                    Image, Video, Audio, or 3D Model{' '}
                    <Typography variant="s2">*</Typography>
                </Typography>
                <Typography variant="p3">
                    File types supported: {SUPPORTED_FILE_TYPES.join(', ')}.
                    (Max size: 10MB) MP4 (Max size: 50MB)
                </Typography>
                <CardWrapper>
                    <input
                        ref={fileRef}
                        style={{ display: 'none' }}
                        // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                        // accept='image/*'
                        accept=".png, .jpg, .gif, .mp4"
                        id="contained-button-file"
                        // multiple
                        type="file"
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
                        <CardOverlay onClick={() => fileRef.current.click()}>
                            <IconButton
                                aria-label="close"
                                onClick={(e) => handleResetFile(e)}
                                sx={
                                    fileUrl
                                        ? {
                                              position: 'absolute',
                                              right: '1vw',
                                              top: '1vh'
                                          }
                                        : { display: 'none' }
                                }
                            >
                                <CloseIcon color="white" />
                            </IconButton>
                        </CardOverlay>
                        {/* <img src={fileUrl} alt='' style={fileUrl ? {objectFit:'cover', width: '100%', height: '100%', overflow:'hidden'} : { display: 'none' }} /> */}

                        <CardMedia
                            component={isVideo ? 'video' : 'img'}
                            image={fileUrl}
                            alt={'NFT'}
                            controls={isVideo}
                            style={
                                fileUrl
                                    ? {
                                          objectFit: 'cover',
                                          width: '100%',
                                          height: '100%',
                                          overflow: 'hidden'
                                      }
                                    : { display: 'none' }
                            }
                        />

                        <ImageIcon
                            fontSize="large"
                            sx={
                                fileUrl
                                    ? { display: 'none' }
                                    : { width: 100, height: 100 }
                            }
                        />
                    </Card>
                </CardWrapper>
            </Stack>
            <Stack spacing={2} mb={3}>
                <Typography variant="p4">
                    Name<Typography variant="s2">*</Typography>
                </Typography>

                <TextField
                    required
                    placeholder="Item name"
                    margin="dense"
                    onChange={(e) => {
                        setNftName(e.target.value);
                    }}
                    value={nftName}
                    sx={{
                        '&.MuiTextField-root': {
                            marginTop: 1
                        }
                    }}
                />
            </Stack>

            {!defaultValues?.collectionName && (
                <Stack spacing={2} mb={3}>
                    <Typography variant="p4">
                        Collection <Typography variant="s2">*</Typography>
                    </Typography>
                    <Typography variant="p3">
                        This is the collection where your item will appear.
                    </Typography>

                    <CustomSelect
                        id="select_collection"
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
                            id="textFilter"
                            // autoFocus
                            fullWidth
                            variant="standard"
                            placeholder="Filter"
                            onChange={handleCollectionQuery}
                            autoComplete="new-password"
                            value={filter}
                            defaultValue={filter}
                            onFocus={(event) => {
                                event.target.select();
                            }}
                            sx={{
                                pl: 2,
                                pr: 2,
                                pb: 2,
                                pt: 2.5
                            }}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        {collections.map((col, idx) => (
                            <MenuItem
                                key={col.uuid}
                                value={col.name}
                                sx={{ pt: 2, pb: 2 }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Avatar
                                        alt="C"
                                        src={`https://s1.xrpnft.com/collection/${col.logoImage}`}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                    <Typography variant="d4">
                                        {col.name}{' '}
                                        <Typography variant="s7">
                                            {' '}
                                            (Taxon: {col.taxon})
                                        </Typography>
                                    </Typography>
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
            )}

            <Stack spacing={2} mb={3}>
                <Typography variant="p4">Attributes</Typography>
                <Typography variant="p3">
                    You can add traits in your NFT metadata.
                </Typography>

                <Grid container spacing={1}>
                    {traits.map((t, idx) => (
                        <Grid
                            item
                            key={'Properties' + idx}
                            xs={6}
                            sm={4}
                            md={3}
                        >
                            <Trait
                                trait={t}
                                onRemoveTrait={handleRemoveTrait}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Stack direction="row">
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleIcon />}
                        size="small"
                        onClick={() => setOpenAddTrait(true)}
                    >
                        Add
                    </Button>
                </Stack>
            </Stack>

            <Stack spacing={2} mb={3}>
                <Typography variant="p4">External link</Typography>
                <Typography variant="p3">
                    {
                        "This site will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details."
                    }
                </Typography>
                <TextField
                    required
                    placeholder="External link"
                    margin="dense"
                    onChange={(e) => {
                        setExtLink(e.target.value);
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
                <Typography variant="p4">Description</Typography>
                <Typography variant="p3">
                    The description will be included on the item's detail page
                    underneath its image.{' '}
                    <Link href="https://www.markdownguide.org/cheat-sheet/">
                        Markdown
                    </Link>{' '}
                    syntax is supported.
                </Typography>
                <TextField
                    placeholder="Provide a detailed description of your NFT"
                    margin="dense"
                    multiline
                    maxRows={4}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
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
                <Typography variant="p4">
                    Royalty <Typography variant="s2">*</Typography>
                    <Typography variant="s7"> (Transfer fee)</Typography>
                </Typography>
                <Typography variant="p3">
                    Between 0.00% and 50.00% in increments of 0.001.
                </Typography>
                <TextField
                    required
                    placeholder=""
                    margin="dense"
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
                <Typography variant="p4">Token Properties</Typography>
                
                <Stack spacing={1.5}>
                    {TOKEN_FLAGS.map((f) => (
                        <FormControlLabel
                            key={f.value}
                            control={
                                <Checkbox
                                    checked={(flag & f.value) !== 0}
                                    onChange={handleFlagChange}
                                    value={f.value}
                                    size="small"
                                />
                            }
                            label={
                                <Stack spacing={0}>
                                    <Typography variant="body2" fontWeight="medium">
                                        {f.label}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {f.desc}
                                    </Typography>
                                </Stack>
                            }
                            sx={{
                                alignItems: 'flex-start',
                                m: 0,
                                p: 1.5,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: (flag & f.value) !== 0 ? 'primary.light' : 'transparent',
                                bgcolor: (flag & f.value) !== 0 ? 'action.hover' : 'transparent',
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                },
                                '& .MuiCheckbox-root': {
                                    pt: 0.5
                                }
                            }}
                        />
                    ))}
                    
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={explicit}
                                onChange={() => setExplicit(!explicit)}
                                size="small"
                                sx={{ color: explicit ? 'warning.main' : 'default' }}
                            />
                        }
                        label={
                            <Stack spacing={0}>
                                <Typography variant="body2" fontWeight="medium" color={explicit ? 'warning.dark' : 'text.primary'}>
                                    Explicit Content ⚠️
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Mark this NFT as containing adult content (18+)
                                </Typography>
                            </Stack>
                        }
                        sx={{
                            alignItems: 'flex-start',
                            m: 0,
                            p: 1.5,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: explicit ? 'warning.light' : 'transparent',
                            bgcolor: explicit ? 'warning.light' : 'transparent',
                            '&:hover': {
                                bgcolor: explicit ? 'warning.light' : 'action.hover'
                            },
                            '& .MuiCheckbox-root': {
                                pt: 0.5
                            }
                        }}
                    />
                </Stack>
            </Stack>

            <Stack alignItems="right">
                <LoadingButton
                    disabled={!canCreate}
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SendIcon />}
                    onClick={onCreateNft}
                    sx={{ mt: 5, mb: 6 }}
                >
                    Create
                </LoadingButton>
            </Stack>

            <QRDialog
                open={openScanQR}
                type="NFTokenMint"
                onClose={handleScanQRClose}
                qrUrl={qrUrl}
                nextUrl={nextUrl}
            />
        </>
    );
}