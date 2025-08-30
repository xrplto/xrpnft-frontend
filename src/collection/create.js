import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router'; // Add this import

// Material
import {
    styled,
    Avatar,
    Button,
    Card,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    Link,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
    useTheme,
    alpha,
    Box,
    Container
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Add this import
import ClassIcon from '@mui/icons-material/Class';

// Iconify
import { Icon } from '@iconify/react';
import rippleSolid from '@iconify/icons-teenyicons/ripple-solid';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { fNumber } from 'src/utils/formatNumber';
import { CATEGORIES } from 'src/utils/constants';

// Components
import LoadingTextField from 'src/components/LoadingTextField';
import AddCostDialog from './AddCostDialog';

const CardWrapper = styled('div')(({ theme }) => ({
    border: `dashed 2px ${alpha(theme.palette.primary.main, 0.3)}`,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(0.5),
    width: 'fit-content',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        cursor: 'pointer',
        borderColor: theme.palette.primary.main,
        transform: 'scale(1.02)',
        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
        '&::after': {
            opacity: 1
        }
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: -3,
        borderRadius: 'inherit',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        zIndex: -1
    }
}));

const CardWrapperCircle = styled('div')(({ theme }) => ({
    border: `dashed 2px ${alpha(theme.palette.primary.main, 0.3)}`,
    borderRadius: '50%',
    padding: theme.spacing(0.5),
    width: 'fit-content',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
        cursor: 'pointer',
        borderColor: theme.palette.primary.main,
        transform: 'scale(1.05)',
        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
        '&::after': {
            opacity: 1
        }
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: -3,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)}, transparent)`,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        zIndex: -1
    }
}));

const CardWrapper3 = styled('div')(({ theme }) => ({
    border: `dashed 2px ${alpha(theme.palette.primary.main, 0.3)}`,
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(0.5),
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
        cursor: 'pointer',
        borderColor: theme.palette.primary.main,
        transform: 'translateY(-2px)',
        boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`
    }
}));

const CardOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    background: alpha(theme.palette.common.black, 0.6),
    inset: 0,
    opacity: 0,
    zIndex: 1,
    transition: 'opacity 0.5s',
    '&:hover': {
        opacity: 1
    }
}));

const CardOverlayCircle = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    background: alpha(theme.palette.common.black, 0.6),
    inset: 0,
    opacity: 0,
    zIndex: 1,
    transition: 'opacity 0.5s',
    '&:hover': {
        opacity: 1
    }
}));

const DisabledButton = styled(Button)({
    '&.Mui-disabled': {
        pointerEvents: 'unset', // allow :hover styles to be triggered
        cursor: 'not-allowed' // and custom cursor can be defined without :hover state
    }
});

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.divider, 0.3)
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: alpha(theme.palette.primary.main, 0.5)
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2
    },
    '& .MuiSelect-select': {
        padding: theme.spacing(2)
    }
}));

const CategoryMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: theme.spacing(2),
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08)
    },
    '&.Mui-selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.16)
        }
    }
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
    '& svg': {
        fontSize: 24
    }
}));

const StyledContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 3,
    boxShadow: theme.palette.mode === 'dark' 
        ? '0 8px 32px rgba(0,0,0,0.4)'
        : '0 8px 32px rgba(0,0,0,0.08)',
    padding: theme.spacing(3),
    position: 'relative',
    backdropFilter: 'blur(10px)',
    background: theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.95)
        : alpha(theme.palette.background.paper, 0.98),
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(5),
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: 1,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        pointerEvents: 'none'
    }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1, 3),
    fontWeight: 600,
}));

const BlurredBackground = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
    zIndex: -1,
    minHeight: '100vh'
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}));

export default function CreateCollection({ showHeader = true, onCreate }) {
    const theme = useTheme();
    const router = useRouter(); // Add this line

    const BASE_URL = 'https://api.xrpnft.com/api';

    const fileRef1 = useRef();
    const fileRef2 = useRef();
    const fileRef3 = useRef();
    const fileRef4 = useRef();

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [loading, setLoading] = useState(false);

    const [openAddCost, setOpenAddCost] = useState(false);

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
    const [name, setName] = useState('');
    const [category, setCategory] = useState('NONE');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('normal');
    const [privateCollection, setPrivateCollection] = useState('no');
    const [bulkUrl, setBulkUrl] = useState('');
    const [costs, setCosts] = useState([]);
    const [taxon, setTaxon] = useState('');
    const [rarity, setRarity] = useState('score');

    // Logo image
    const [fileUrl1, setFileUrl1] = useState(null);
    const [file1, setFile1] = useState(null);
    // Featured image
    const [fileUrl2, setFileUrl2] = useState(null);
    const [file2, setFile2] = useState(null);
    // Banner image
    const [fileUrl3, setFileUrl3] = useState(null);
    const [file3, setFile3] = useState(null);
    // Spinner GIF image
    const [fileUrl4, setFileUrl4] = useState(null);
    const [file4, setFile4] = useState(null);

    const [valid1, setValid1] = useState(false); // Name validation check
    const [valid2, setValid2] = useState(false); // Slug validation check
    const [passphrase, setPassPhrase] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    let canCreate = file1 && name && slug && valid1 && valid2 && validPassword;

    if (type !== 'normal') {
        if (!bulkUrl || costs.length < 1) canCreate = false;
    }

    const getTaxon = () => {
        // https://api.xrpnft.com/api/taxon?account=
        axios
            .get(`${BASE_URL}/taxon/available?account=${account}`)
            .then((res) => {
                try {
                    if (res.status === 200 && res.data) {
                        const ret = res.data;
                        setTaxon(ret.taxon + 1);
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
        getTaxon();
    }, []);

    const onCreateCollection = async () => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            let res;

            const formdata = new FormData();

            let fileFlag = [true, false, false, false];
            formdata.append('imgCollection', file1);
            if (file2) {
                fileFlag[1] = true;
                formdata.append('imgCollection', file2);
            }
            if (file3) {
                fileFlag[2] = true;
                formdata.append('imgCollection', file3);
            }
            if (file4) {
                fileFlag[3] = true;
                formdata.append('imgCollection', file4);
            }

            const data = {};
            data.name = name;
            data.category = category;
            data.slug = slug;
            data.description = description;
            data.fileFlag = fileFlag;
            data.type = type;
            data.rarity = rarity;
            data.private = privateCollection;
            if (type !== 'normal') {
                data.costs = costs;
                data.bulkUrl = bulkUrl;
            }

            data.passphrase = passphrase;

            formdata.append('account', account);
            formdata.append('data', JSON.stringify(data));

            // https://api.xrpnft.com/api/collection/create
            res = await axios.post(`${BASE_URL}/collection/create`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': accountToken
                }
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
                        "URI": "516D656A506E6E6775635A5644723637583937324C313842726A6F317241503842794754796137645259763234",
                        "uuid": "d1dcfe3cac80409793629707de2aafbf",
                        "minted": false,
                        "_id": "6308bc3d7a1dec795f21fc33"
                    } */
                    openSnackbar('Create collection successful!', 'success');
                    onCreate(data.slug);
                } else {
                    // { status: false, data: null, err: 'ERR_URL_SLUG' }
                    const err = ret.err;
                    openSnackbar(err, 'error');
                }
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const processFile = (pickedFile, idx) => {
        if (!pickedFile) return false;

        const fileName = pickedFile.name;
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(fileName)[1];
        if (ext) ext = ext.toLowerCase();
        if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
            const size = pickedFile.size;
            if (size < 10240000) {
                // setImgExt(ext);
                if (idx === 1) setFile1(pickedFile);
                else if (idx === 2) setFile2(pickedFile);
                else if (idx === 3) setFile3(pickedFile);
                else if (idx === 4) setFile4(pickedFile);

                // This is used as src of image
                const reader = new FileReader();
                reader.readAsDataURL(pickedFile);
                reader.onloadend = function (e) {
                    if (idx === 1)
                        setFileUrl1(reader.result); // data:image/jpeg;base64
                    else if (idx === 2) setFileUrl2(reader.result);
                    else if (idx === 3) setFileUrl3(reader.result);
                    else if (idx === 4) setFileUrl4(reader.result);
                };
                return true;
            } else {
                openSnackbar(
                    'You can only upload images size less than 10MB',
                    'error'
                );
            }
        }
        return false;
    };

    const handleFileSelect1 = (e) => {
        const pickedFile = e.target.files[0];
        const ret = processFile(pickedFile, 1);
        if (!ret) fileRef1.current.value = null;
    };

    const handleFileSelect2 = (e) => {
        const pickedFile = e.target.files[0];
        const ret = processFile(pickedFile, 2);
        if (!ret) fileRef2.current.value = null;
    };

    const handleFileSelect3 = (e) => {
        const pickedFile = e.target.files[0];
        const ret = processFile(pickedFile, 3);
        if (!ret) fileRef3.current.value = null;
    };

    const handleFileSelect4 = (e) => {
        const pickedFile = e.target.files[0];
        const ret = processFile(pickedFile, 4);
        if (!ret) fileRef4.current.value = null;
    };

    const handleResetFile1 = (e) => {
        e.stopPropagation();
        setFile1(null);
        setFileUrl1(null);
        fileRef1.current.value = null;
    };

    const handleResetFile2 = (e) => {
        e.stopPropagation();
        setFile2(null);
        setFileUrl2(null);
        fileRef2.current.value = null;
    };

    const handleResetFile3 = (e) => {
        e.stopPropagation();
        setFile3(null);
        setFileUrl3(null);
        fileRef3.current.value = null;
    };

    const handleResetFile4 = (e) => {
        e.stopPropagation();
        setFile4(null);
        setFileUrl4(null);
        fileRef4.current.value = null;
    };

    const handleChangeType = (event, newType) => {
        setType(newType);
    };

    const handleChangePrivate = (event, newValue) => {
        setPrivateCollection(newValue);
    };

    const handleAddCost = (cost) => {
        for (var c of costs) {
            if (c.md5 === cost.md5) {
                c.amount = cost.amount;
                return;
            }
        }
        costs.push(cost);
    };

    const handleRemoveCost = (md5) => {
        const newCosts = [];
        for (var c of costs) {
            if (c.md5 !== md5) newCosts.push(c);
        }
        setCosts(newCosts);
    };

    const handleChangeCategory = (event) => {
        const value = event.target.value;
        setCategory(value);
    };

    const handleChangeRarity = (event) => {
        const value = event.target.value;
        setRarity(value);
    };

    const handleGoBack = () => {
        router.push('/create');
    };

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <StyledContainer>
                <Stack spacing={4}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        {showHeader && (
                            <>
                                <Button
                                    startIcon={<ArrowBackIcon />}
                                    onClick={handleGoBack}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3,
                                        py: 1.25,
                                        borderColor: theme => alpha(theme.palette.primary.main, 0.3),
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: theme => theme.palette.primary.main,
                                            backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
                                            transform: 'translateX(-4px)'
                                        }
                                    }}
                                >
                                    Back to Create
                                </Button>
                                <Typography 
                                    variant="h3" 
                                    component="h1" 
                                    fontWeight="800"
                                    sx={{
                                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textAlign: 'center'
                                    }}
                                >
                                    Create Your Collection
                                </Typography>
                                <Box sx={{ width: 150 }} />
                            </>
                        )}
                        {!showHeader && (
                            <Box />
                        )}
                    </Stack>
                    
                    <AddCostDialog
                        open={openAddCost}
                        setOpen={setOpenAddCost}
                        openSnackbar={openSnackbar}
                        onAddCost={handleAddCost}
                    />
                    
                    {/* Logo Image Section */}
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            background: theme => alpha(theme.palette.primary.main, 0.02),
                            border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.08)}`
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: 'error.main',
                                    animation: 'pulse 2s infinite'
                                }}
                            />
                            <Typography variant="subtitle2" color="text.secondary" fontWeight="500">
                                Required field
                            </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
                            Logo Image
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                            Your collection's visual identity. This will appear throughout the marketplace.
                            <Box component="span" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                                Recommended: 350 x 350px • Max: 10MB • PNG, JPG, GIF
                            </Box>
                        </Typography>
                        <CardWrapperCircle>
                            <input
                                ref={fileRef1}
                                style={{ display: 'none' }}
                                // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                                // accept='image/*'
                                accept=".png, .jpg, .gif"
                                id="contained-button-file1"
                                // multiple
                                type="file"
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
                                        aria-label="close"
                                        onClick={(e) => handleResetFile1(e)}
                                        sx={
                                            fileUrl1
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
                                </CardOverlayCircle>
                                <img
                                    src={fileUrl1}
                                    alt=""
                                    style={
                                        fileUrl1
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
                                        fileUrl1
                                            ? { display: 'none' }
                                            : { width: 64, height: 64 }
                                    }
                                />
                            </Card>
                        </CardWrapperCircle>
                    </Box>

                    {/* Featured Image Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Featured image
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            This image will be used for featuring your collection on
                            the homepage, category pages, or other promotional areas
                            of XRPNFT.COM. 600 x 400 recommended.(Max: 10MB)
                        </Typography>
                        <CardWrapper>
                            <input
                                ref={fileRef2}
                                style={{ display: 'none' }}
                                // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                                // accept='image/*'
                                accept=".png, .jpg, .gif"
                                id="contained-button-file2"
                                // multiple
                                type="file"
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
                                        aria-label="close"
                                        onClick={(e) => handleResetFile2(e)}
                                        sx={
                                            fileUrl2
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
                                <img
                                    src={fileUrl2}
                                    alt=""
                                    style={
                                        fileUrl2
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
                                        fileUrl2
                                            ? { display: 'none' }
                                            : { width: 100, height: 100 }
                                    }
                                />
                            </Card>
                        </CardWrapper>
                    </Box>

                    {/* Banner Image Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Banner image
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            This image will appear at the top of your collection
                            page. Avoid including too much text in this banner
                            image, as the dimensions change on different devices.
                            1400 x 350 recommended.(Max: 10MB)
                        </Typography>
                        <CardWrapper3>
                            <input
                                ref={fileRef3}
                                style={{ display: 'none' }}
                                // accept='image/*,video/*,audio/*,webgl/*,.glb,.gltf'
                                // accept='image/*'
                                accept=".png, .jpg, .gif"
                                id="contained-button-file3"
                                // multiple
                                type="file"
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
                                        aria-label="close"
                                        onClick={(e) => handleResetFile3(e)}
                                        sx={
                                            fileUrl3
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
                                <img
                                    src={fileUrl3}
                                    alt=""
                                    style={
                                        fileUrl3
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
                                        fileUrl3
                                            ? { display: 'none' }
                                            : { width: 100, height: 100 }
                                    }
                                />
                            </Card>
                        </CardWrapper3>
                    </Box>

                    {/* Name Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Name *
                        </Typography>
                        <LoadingTextField
                            id="id_collection_name"
                            placeholder="Example: My XRPL NFTs"
                            type="COLLECTION_NAME"
                            startText=""
                            value={name}
                            setValid={setValid1}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            fullWidth
                        />
                    </Box>

                    {/* Category Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600">
                            Category
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This helps your NFT to be found when people search by
                            category. Once you set, you cannot change the category when
                            you edit your collection.
                        </Typography>
                        <CustomSelect
                            id="select_category"
                            value={category}
                            onChange={handleChangeCategory}
                            MenuProps={{ 
                                disableScrollLock: true,
                                PaperProps: {
                                    sx: {
                                        maxHeight: 400,
                                        '& .MuiList-root': {
                                            padding: 1
                                        }
                                    }
                                }
                            }}
                            renderValue={(value) => {
                                const selectedCat = CATEGORIES.find(cat => cat.title === value);
                                return (
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <CategoryIcon>
                                            {selectedCat?.icon || <ClassIcon />}
                                        </CategoryIcon>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="500">
                                                {value || 'Select a category'}
                                            </Typography>
                                            {value !== 'NONE' && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {selectedCat?.slug}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                );
                            }}
                        >
                            {CATEGORIES.map((cat, idx) => (
                                <CategoryMenuItem
                                    key={idx}
                                    value={cat.title}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        alignItems="center"
                                        sx={{ width: '100%' }}
                                    >
                                        <CategoryIcon>
                                            {cat.icon}
                                        </CategoryIcon>
                                        <Box flex={1}>
                                            <Typography variant="subtitle1" fontWeight="500">
                                                {cat.title}
                                            </Typography>
                                            {cat.slug && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {cat.slug}
                                                </Typography>
                                            )}
                                        </Box>
                                        {category === cat.title && (
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main'
                                                }}
                                            />
                                        )}
                                    </Stack>
                                </CategoryMenuItem>
                            ))}
                        </CustomSelect>
                    </Box>

                    {/* URL Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            URL *
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Customize your URL on XRPNFT.COM. Must only contain
                            lowercase letters, numbers, and hyphens.
                        </Typography>
                        <LoadingTextField
                            id="id_collection_slug"
                            placeholder="my-xrpl-nfts"
                            type="COLLECTION_SLUG"
                            startText="https://xrpnft.com/collection/"
                            value={slug}
                            setValid={setValid2}
                            onChange={(e) => {
                                const value = e.target.value;
                                const newSlug = value
                                    ? value.replace(/[^a-z0-9-]/g, '')
                                    : '';
                                setSlug(newSlug);
                            }}
                            fullWidth
                        />
                    </Box>

                    {/* Type Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Type *
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Select your collection type to determine how NFTs will be minted.
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                {
                                    value: 'normal',
                                    label: 'Normal',
                                    description: 'Mint NFTs one by one for this collection'
                                },
                                {
                                    value: 'bulk',
                                    label: 'Bulk',
                                    description: 'Upload bulk NFTs and sell NFTs with Mints'
                                },
                                {
                                    value: 'random',
                                    label: 'Random',
                                    description: 'Upload bulk NFTs and sell NFTs randomly with Mints'
                                },
                                {
                                    value: 'sequence',
                                    label: 'Sequence',
                                    description: 'Upload bulk NFTs and sell NFTs sequentially with Mints'
                                }
                            ].map((option) => (
                                <Grid item xs={12} sm={6} key={option.value}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            cursor: 'pointer',
                                            border: theme => `2px solid ${
                                                type === option.value 
                                                    ? theme.palette.primary.main 
                                                    : alpha(theme.palette.divider, 0.2)
                                            }`,
                                            backgroundColor: theme => 
                                                type === option.value 
                                                    ? alpha(theme.palette.primary.main, 0.04)
                                                    : theme.palette.background.paper,
                                            transition: 'all 0.2s ease',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            '&:hover': {
                                                borderColor: theme => alpha(theme.palette.primary.main, 0.4),
                                                backgroundColor: theme => alpha(theme.palette.primary.main, 0.02),
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }
                                        }}
                                        onClick={() => handleChangeType({ target: { value: option.value } })}
                                    >
                                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                            <Box flex={1}>
                                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                                    {option.label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.description}
                                                </Typography>
                                            </Box>
                                            {type === option.value && (
                                                <Box
                                                    sx={{
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'primary.main',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        flexShrink: 0,
                                                        ml: 2
                                                    }}
                                                >
                                                    ✓
                                                </Box>
                                            )}
                                        </Stack>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {type !== 'normal' && (
                            <>
                                <Stack spacing={1}>
                                    {type === 'bulk' ? (
                                        <Typography variant="p2">
                                            Costs per NFT{' '}
                                            <Typography variant="s2">*</Typography>
                                        </Typography>
                                    ) : (
                                        <Typography variant="p2">
                                            Costs per Mint{' '}
                                            <Typography variant="s2">*</Typography>
                                        </Typography>
                                    )}
                                    <Typography variant="p3" sx={{ pb: 2 }}>
                                        You need to add at least 1 currency to
                                        create a collection.
                                    </Typography>

                                    {costs.map((cost, idx) => (
                                        <Stack
                                            spacing={1}
                                            sx={{ pl: 1, pr: 1 }}
                                            key={cost.md5}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={2}
                                                sx={{ mt: 0 }}
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                >
                                                    <Avatar
                                                        alt="C"
                                                        src={`https://s1.xrpl.to/token/${cost.md5}`}
                                                        sx={{ mr: 2 }}
                                                    />
                                                    <Stack spacing={0.5}>
                                                        <Stack direction="row">
                                                            <Typography variant="d4">
                                                                {cost.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="d4"
                                                                sx={{ ml: 2 }}
                                                                noWrap
                                                            >
                                                                <Icon
                                                                    icon={
                                                                        rippleSolid
                                                                    }
                                                                    width={12}
                                                                    height={12}
                                                                />{' '}
                                                                {fNumber(cost.exch)}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                        >
                                                            <Typography variant="p3">
                                                                {cost.issuer}
                                                            </Typography>
                                                            {cost.currency !==
                                                                'XRP' && (
                                                                <Link
                                                                    underline="none"
                                                                    color="inherit"
                                                                    target="_blank"
                                                                    href={`https://bithomp.com/explorer/${cost.issuer}`}
                                                                    rel="noreferrer noopener nofollow"
                                                                >
                                                                    <Tooltip title="Check on Bithomp">
                                                                        <IconButton
                                                                            edge="end"
                                                                            aria-label="bithomp"
                                                                            size="small"
                                                                        >
                                                                            <Avatar
                                                                                alt="bithomp"
                                                                                src="/static/bithomp.ico"
                                                                                sx={{
                                                                                    width: 16,
                                                                                    height: 16
                                                                                }}
                                                                            />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Link>
                                                            )}
                                                        </Stack>
                                                    </Stack>
                                                </Stack>

                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    alignItems="center"
                                                >
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="flex-end"
                                                    >
                                                        <Typography
                                                            variant="p4"
                                                            color="#EB5757"
                                                        >
                                                            {cost.amount}
                                                        </Typography>
                                                        <Typography variant="s2">
                                                            {cost.name}
                                                        </Typography>
                                                    </Stack>

                                                    <IconButton
                                                        onClick={() =>
                                                            handleRemoveCost(
                                                                cost.md5
                                                            )
                                                        }
                                                    >
                                                        <HighlightOffOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </Stack>
                                            <Divider />
                                        </Stack>
                                    ))}

                                    <Stack
                                        direction="row"
                                        sx={{ pl: 1, pt: 1, pb: 3 }}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddCircleIcon />}
                                            size="small"
                                            onClick={() => setOpenAddCost(true)}
                                        >
                                            Add
                                        </Button>
                                    </Stack>
                                </Stack>

                                <Stack spacing={2} sx={{ pl: 0 }}>
                                    <Typography variant="p2">
                                        Paste the Google Drive file shared link URL
                                        here.{' '}
                                        <Typography variant="s2">*</Typography>
                                    </Typography>
                                    <Typography variant="p3">
                                        Upload .zip file contains your NFT images to
                                        Google Drive and copy & paste the shared
                                        link URL.
                                    </Typography>
                                    {/* <Typography variant='p3'>
                                        https://drive.google.com/file/d/1xjA-1bodiMrvSCtdTEMim5x1Cam74bXU/view
                                    </Typography> */}

                                    <TextField
                                        id="id_bulk_url"
                                        placeholder="https://drive.google.com/file/d/1xjA-1dkjiMtvSTcSTEMim5x1Cam74bXU/view"
                                        value={bulkUrl}
                                        onChange={(e) => {
                                            setBulkUrl(e.target.value);
                                        }}
                                    />
                                </Stack>

                                {(type === 'random' || type === 'sequence') && (
                                    <>
                                        <Typography
                                            variant="p4"
                                            sx={{ pt: 2, pb: 1 }}
                                        >
                                            Spinner GIF image
                                        </Typography>
                                        <Typography variant="p3">
                                            This image will be used for spinning
                                            NFTs. If you don't select, the &nbsp;
                                            <Link
                                                target="_blank"
                                                href={`/static/spin.gif`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                default spinning image
                                            </Link>
                                            &nbsp; will be used. 600 x 400
                                            recommended. (Max: 10MB)
                                        </Typography>
                                        <CardWrapper>
                                            <input
                                                ref={fileRef4}
                                                style={{ display: 'none' }}
                                                accept=".png, .jpg, .gif"
                                                id="contained-button-file4"
                                                // multiple
                                                type="file"
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
                                                    onClick={() =>
                                                        fileRef4.current.click()
                                                    }
                                                >
                                                    <IconButton
                                                        aria-label="close"
                                                        onClick={(e) =>
                                                            handleResetFile4(e)
                                                        }
                                                        sx={
                                                            fileUrl4
                                                                ? {
                                                                      position:
                                                                          'absolute',
                                                                      right: '1vw',
                                                                      top: '1vh'
                                                                  }
                                                                : {
                                                                      display:
                                                                          'none'
                                                                  }
                                                        }
                                                    >
                                                        <CloseIcon color="white" />
                                                    </IconButton>
                                                </CardOverlay>
                                                <img
                                                    src={fileUrl4}
                                                    alt=""
                                                    style={
                                                        fileUrl4
                                                            ? {
                                                                  objectFit:
                                                                      'cover',
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
                                                        fileUrl4
                                                            ? { display: 'none' }
                                                            : {
                                                                  width: 100,
                                                                  height: 100
                                                              }
                                                    }
                                                />
                                            </Card>
                                        </CardWrapper>
                                    </>
                                )}
                            </>
                        )}
                    </Box>

                    {/* Description Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Description
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            <Link href="https://www.markdownguide.org/cheat-sheet/">
                                Markdown
                            </Link>{' '}
                            syntax is supported. 0 of 1000 characters used.
                        </Typography>
                        <TextField
                            placeholder="Provide a detailed description of your collection"
                            margin="dense"
                            multiline
                            rows={4}
                            fullWidth
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            sx={{
                                '&.MuiTextField-root': {
                                    marginTop: 1
                                },
                                '& .MuiOutlinedInput-root': {
                                    alignItems: 'start'
                                }
                            }}
                        />
                    </Box>

                    {/* Taxon Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Taxon
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Taxon links NFTs to this collection, NFTs minted for
                            this collection will have this Taxon in their NFTokenID
                            field. Taxon is automatically set.
                        </Typography>

                        <TextField
                            id="id_collection_taxon"
                            disabled
                            placeholder="Automatically generated"
                            margin="dense"
                            fullWidth
                            value={taxon}
                        />
                    </Box>

                    {/* Rarity Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Rarity *
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Select your collection's rarity calculation method.{' '}
                            <Link
                                target="_blank"
                                href={`https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c`}
                                rel="noreferrer noopener nofollow"
                                sx={{ fontWeight: 500 }}
                            >
                                Learn More →
                            </Link>
                        </Typography>

                        <RadioGroup
                            aria-labelledby="rarity-radio-buttons-group"
                            name="rarity-radio-buttons-group"
                            value={rarity}
                            onChange={handleChangeRarity}
                        >
                            <Stack spacing={2}>
                                {[
                                    {
                                        value: 'standard',
                                        label: 'Standard',
                                        description: 'Simply compare the rarest trait of each NFT (%)'
                                    },
                                    {
                                        value: 'average',
                                        label: 'Average',
                                        description: 'Average the rarity of traits that exist on the NFT (%)'
                                    },
                                    {
                                        value: 'statistical',
                                        label: 'Statistical',
                                        description: 'Multiply all of its trait rarities together (%)'
                                    },
                                    {
                                        value: 'score',
                                        label: 'Score',
                                        description: 'Sum of the Rarity Score of all trait values (not %, just a value)'
                                    },
                                    {
                                        value: 'self',
                                        label: 'Self',
                                        description: 'Rarity and Rank are included in each NFT metadata'
                                    }
                                ].map((option) => (
                                    <Card
                                        key={option.value}
                                        sx={{
                                            p: 2.5,
                                            cursor: 'pointer',
                                            border: theme => `2px solid ${
                                                rarity === option.value 
                                                    ? theme.palette.primary.main 
                                                    : alpha(theme.palette.divider, 0.2)
                                            }`,
                                            backgroundColor: theme => 
                                                rarity === option.value 
                                                    ? alpha(theme.palette.primary.main, 0.04)
                                                    : theme.palette.background.paper,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                borderColor: theme => alpha(theme.palette.primary.main, 0.4),
                                                backgroundColor: theme => alpha(theme.palette.primary.main, 0.02),
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                            }
                                        }}
                                        onClick={() => handleChangeRarity({ target: { value: option.value } })}
                                    >
                                        <FormControlLabel
                                            value={option.value}
                                            control={
                                                <Radio 
                                                    sx={{ 
                                                        display: 'none'
                                                    }} 
                                                />
                                            }
                                            label={
                                                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                                    <Box flex={1}>
                                                        <Typography variant="h6" fontWeight="600" gutterBottom>
                                                            {option.label}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {option.description}
                                                        </Typography>
                                                    </Box>
                                                    {rarity === option.value && (
                                                        <Box
                                                            sx={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                backgroundColor: 'primary.main',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 'bold',
                                                                flexShrink: 0,
                                                                ml: 2
                                                            }}
                                                        >
                                                            ✓
                                                        </Box>
                                                    )}
                                                </Stack>
                                            }
                                            sx={{ 
                                                margin: 0, 
                                                width: '100%',
                                                '& .MuiFormControlLabel-label': {
                                                    width: '100%'
                                                }
                                            }}
                                        />
                                    </Card>
                                ))}
                            </Stack>
                        </RadioGroup>
                    </Box>

                    {/* Private Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Token Properties *
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Control the visibility and access settings for your NFT collection.
                        </Typography>

                        <Stack spacing={2}>
                            {[
                                {
                                    value: 'no',
                                    label: 'Public Collection',
                                    description: 'Your collection will be visible to everyone and searchable on the marketplace'
                                },
                                {
                                    value: 'yes',
                                    label: 'Private Collection',
                                    description: 'Keep your collection hidden from public view until you decide to publish it'
                                }
                            ].map((option) => (
                                <Card
                                    key={option.value}
                                    sx={{
                                        p: 2.5,
                                        cursor: 'pointer',
                                        border: theme => `2px solid ${
                                            privateCollection === option.value 
                                                ? theme.palette.primary.main 
                                                : alpha(theme.palette.divider, 0.2)
                                        }`,
                                        backgroundColor: theme => 
                                            privateCollection === option.value 
                                                ? alpha(theme.palette.primary.main, 0.04)
                                                : theme.palette.background.paper,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: theme => alpha(theme.palette.primary.main, 0.4),
                                            backgroundColor: theme => alpha(theme.palette.primary.main, 0.02),
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                                        }
                                    }}
                                    onClick={() => handleChangePrivate(null, option.value)}
                                >
                                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                        <Box flex={1}>
                                            <Typography variant="h6" fontWeight="600" gutterBottom>
                                                {option.label}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {option.description}
                                            </Typography>
                                        </Box>
                                        {privateCollection === option.value && (
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'primary.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    flexShrink: 0,
                                                    ml: 2
                                                }}
                                            >
                                                ✓
                                            </Box>
                                        )}
                                    </Stack>
                                </Card>
                            ))}
                        </Stack>
                    </Box>

                    {/* Passphrase Section */}
                    <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ mb: 1 }}>
                            Passphrase *
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Contact support to get your own passphrase for your
                            account. Once you get your passphrase, you can use it
                            for 10 times only, if you want more, contact support
                            again to get the new passphrase.
                        </Typography>

                        <Link
                            href="https://xrpnft.com/discord"
                            sx={{ mt: 1.5, display: 'inline-flex' }}
                            underline="none"
                            target="_blank"
                            rel="noreferrer noopener nofollow"
                        >
                            <Typography variant="s2" color="#33C2FF">
                                Contact us on Discord
                            </Typography>
                        </Link>

                        <LoadingTextField
                            id="id_create_collection_passphrase"
                            type="PASSPHRASE_CREATE_COLLECTION"
                            placeholder="Enter your passphrase"
                            startText=""
                            value={passphrase}
                            setValid={setValidPassword}
                            onChange={(e) => {
                                setPassPhrase(e.target.value);
                            }}
                            fullWidth
                        />
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mt: 6,
                        p: 4,
                        borderRadius: 3,
                        background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)}, transparent)`
                    }}>
                        <LoadingButton
                            disabled={!canCreate}
                            variant="contained"
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SendIcon />}
                            onClick={onCreateCollection}
                            sx={{
                                minWidth: 280,
                                height: 64,
                                borderRadius: 100,
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                letterSpacing: '0.5px',
                                background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme => `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                                },
                                '&:disabled': {
                                    background: theme => alpha(theme.palette.action.disabledBackground, 0.8),
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                                    transform: 'translate(-50%, -50%) scale(0)',
                                    transition: 'transform 0.6s ease',
                                    pointerEvents: 'none'
                                },
                                '&:active::before': {
                                    transform: 'translate(-50%, -50%) scale(2)'
                                }
                            }}
                        >
                            Create Collection
                        </LoadingButton>
                    </Box>
                </Stack>
            </StyledContainer>
        </Box>
    );
}