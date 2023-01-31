import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Material
import {
    useTheme,
    Avatar,
    Box,
    Button,
    CardMedia,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    Divider
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import { NFToken, statusToString } from 'src/utils/constants';
import { convertHexToString } from 'src/utils/parse';

// Components
import ListToolbar from '../ListToolbar';
import FlagsContainer from 'src/components/Flags';
// ----------------------------------------------------------------------

const NFTFix = { // 4:23 PM 12/11/2022
    RESOLVE_ONE: 1,
    RESOLVE_PAGE: 2,
    RESOLVE_ALL: 3,
    RESOLVE_PREOFFER_E2: 4,
    RESOLVE_PREMINT_E3: 5,
    RESOLVE_PREMINT: 6
}

export default function ErrorList({ filter, choice, setLoading }) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [nfts, setNfts] = useState([]);

    const [sync, setSync] = useState(0);

    useEffect(() => {
        function getNfts() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            const body = { filter, choice };

            axios.post(`${BASE_URL}/admin/errors?page=${page}&limit=${rows}`, body, { headers: { 'x-access-account': accountAdmin, 'x-access-token': accountToken } })
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setNfts(ret.nfts);
                    }
                }).catch(err => {
                    console.log("Error on getting errored nfts list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getNfts();
    }, [accountAdmin, accountToken, page, rows, filter, choice, sync]);

    const onResolveNFT = async (nfts, type) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const uuidset = [];
            for (const nft of nfts) {
                uuidset.push(nft.uuid);
            }

            const body = { uuidset, type };

            const res = await axios.post(`${BASE_URL}/admin/resolve_nft`, body, { headers: { 'x-access-account': accountAdmin, 'x-access-token': accountToken } });

            const ret = res.data;
            if (ret) {
                if (ret.status) {
                    openSnackbar('Successfully submitted', 'success');
                    setSync(sync + 1);
                } else {
                    openSnackbar(ret.err, 'error');
                }
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading(false);
    };

    const onRemoveNFT = async (uuid) => {
        if (!accountAdmin || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        setLoading(true);
        try {
            const body = { uuid };

            const res = await axios.post(`${BASE_URL}/admin/remove_nft`, body, { headers: { 'x-access-account': accountAdmin, 'x-access-token': accountToken } });

            const ret = res.data;
            if (ret) {
                if (ret.status) {
                    openSnackbar('Successfully removed!', 'success');
                    setSync(sync + 1);
                } else {
                    openSnackbar(ret.err, 'error');
                }
            }
        } catch (err) {
            console.error(err);
            openSnackbar('Error', 'error');
        }
        setLoading(false);
    };

    const handleResolve = (nft) => {
        let type = NFTFix.RESOLVE_ONE;
        if (nft.status === NFToken.PREOFFER_E2)
            type = NFTFix.RESOLVE_PREOFFER_E2;
        else if (nft.status === NFToken.PREMINT)
            type = NFTFix.RESOLVE_PREMINT;

        onResolveNFT([nft], type);
    }

    const handleRemove = (nft) => {
        onRemoveNFT(nft.uuid);
    }

    const handleResolvePage = () => {
        onResolveNFT(nfts, NFTFix.RESOLVE_PAGE);
    }

    const handleResolveAll = () => {
        onResolveNFT([], NFTFix.RESOLVE_ALL);
    }

    return (
        <>
            {total > 0 ?
                <>
                    {(choice === "error" || choice === "nodest") &&
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button variant="contained" color="primary" size="small" onClick={() => handleResolveAll()}>
                                Resolve All
                            </Button>

                            <Typography variant="s2">Click only once and be patient!</Typography>

                            {/* <Button variant="contained" color="primary" size="small" onClick={()=>handleResolvePage()}>
                                Resolve Page
                            </Button> */}
                        </Stack>
                    }
                    <ListToolbar
                        count={total}
                        rows={rows}
                        setRows={setRows}
                        page={page}
                        setPage={setPage}
                    />
                </>
                :
                <>
                    <Stack alignItems="center" sx={{ mt: 5 }}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
                </>
            }

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    py: 1,
                    overflow: "auto",
                    width: "100%",
                    "& > *": {
                        scrollSnapAlign: "center",
                    },
                    "::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Table stickyHeader sx={{
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "1px solid",
                        borderColor: theme.palette.divider
                    }
                }}>
                    <TableBody>
                        {
                            // {
                            //     "_id": "632683afa45d7f463e8ef870",
                            //     "account": "rHAfrQNDBohGbWuWTWzpJe1LQWyYVnbG2n",
                            //     "name": "TestCollection-1",
                            //     "slug": "test1",
                            //     "type": "bulk",
                            //     "bulkUrl": "https://drive.google.com/file/d/1xjA-1bodiMrvSCtdTEMim5x1Cam74bXU/view",
                            //     "status": 7,
                            //     "description": "This is the description of test1 collection",
                            //     "logoImage": "1663468463243_3d1cc658af10407fabf2c5e96bde2ab4.png",
                            //     "featuredImage": "1663468463243_220f174cbce64122b203c6bccafab57c.jpg",
                            //     "bannerImage": "1663468463245_dcb8db64b5b84da49fd2839508cc0618.jpg",
                            //     "created": 1663468463251,
                            //     "modified": 1663468463251,
                            //     "uuid": "92d8b1d1ac3d48369e98463e6ec29678",
                            //     "creator": "xrpnft.com",
                            //     "infoDOWNLOAD": {
                            //         "size": "2.47 GB"
                            //     }
                            // }
                            // exchs.slice(page * rows, page * rows + rows)
                            nfts && nfts.map((row) => {
                                const {
                                    uuid,
                                    name,
                                    collection,
                                    minter,
                                    issuer,
                                    flag,
                                    account,
                                    date,
                                    time,
                                    destination,
                                    meta,
                                    URI,
                                    NFTokenID,
                                    mintHash,
                                    offerHash,
                                    status,
                                    error,
                                    resolve,
                                    SellOfferID
                                } = row;

                                const strDateTime = formatDateTime(date);

                                return (
                                    <TableRow
                                        // hover
                                        key={uuid}
                                        sx={{
                                            [`& .${tableCellClasses.root}`]: {
                                                // color: (error ? '#B72136' : '#B72136')
                                            }
                                        }}
                                    >
                                        {/* <TableCell align="left"><Typography variant="subtitle2">{id}</Typography></TableCell> */}
                                        {/* <TableCell align="left">
                                        {isVideo?
                                            <CardMedia
                                                component="video"
                                                image={imgUrl}
                                                title='title'
                                                controls
                                                style={{
                                                    width: 96,
                                                    height: 96,
                                                    filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                                }}
                                            />
                                            :
                                            <ModalImage
                                                className='nftpreview1'
                                                small={imgUrl}
                                                large={imgUrl}
                                                alt={name}
                                                hideDownload
                                                hideZoom
                                                style={{
                                                    width: 96,
                                                    height: 96,
                                                    filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                                }}
                                            />
                                        }
                                    </TableCell> */}

                                        <TableCell align="left">
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={2} alignItems="row">
                                                    <Typography variant="s3" color="#33C2FF">{name}</Typography>
                                                    <FlagsContainer Flags={flag} />
                                                    <Typography variant="s7">{strDateTime}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Collection: </Typography>
                                                    <Typography variant="s6">{collection}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">UUID: </Typography>
                                                    <Typography variant="s7">{uuid}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Account: </Typography>
                                                    <Stack direction="row" spacing={0.2} alignItems="center">
                                                        <Typography variant="s7">{account}</Typography>
                                                        <Link
                                                            underline="none"
                                                            color="inherit"
                                                            target="_blank"
                                                            href={`https://bithomp.com/explorer/${account}`}
                                                            rel="noreferrer noopener nofollow"
                                                        >
                                                            <Tooltip title="Check on Bithomp">
                                                                <IconButton edge="end" aria-label="bithomp" size="small">
                                                                    <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                        <CopyToClipboard text={account} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                            <Tooltip title='Click to copy'>
                                                                <IconButton size="small">
                                                                    <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>
                                                </Stack>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Minter: </Typography>
                                                    <Stack direction="row" spacing={0.2} alignItems="center">
                                                        <Typography variant="s7">{account}</Typography>
                                                        <Link
                                                            underline="none"
                                                            color="inherit"
                                                            target="_blank"
                                                            href={`https://bithomp.com/explorer/${minter}`}
                                                            rel="noreferrer noopener nofollow"
                                                        >
                                                            <Tooltip title="Check on Bithomp">
                                                                <IconButton edge="end" aria-label="bithomp" size="small">
                                                                    <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                        <CopyToClipboard text={minter} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                            <Tooltip title='Click to copy'>
                                                                <IconButton size="small">
                                                                    <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>
                                                </Stack>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Issuer: </Typography>
                                                    <Stack direction="row" spacing={0.2} alignItems="center">
                                                        <Typography variant="s7">{issuer}</Typography>
                                                        <Link
                                                            underline="none"
                                                            color="inherit"
                                                            target="_blank"
                                                            href={`https://bithomp.com/explorer/${issuer}`}
                                                            rel="noreferrer noopener nofollow"
                                                        >
                                                            <Tooltip title="Check on Bithomp">
                                                                <IconButton edge="end" aria-label="bithomp" size="small">
                                                                    <Avatar alt="bithomp" src="/static/bithomp.ico" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Link>
                                                        <CopyToClipboard text={issuer} onCopy={() => openSnackbar('Copied!', 'success')}>
                                                            <Tooltip title='Click to copy'>
                                                                <IconButton size="small">
                                                                    <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Destination: </Typography>
                                                    <Typography variant="s7">{destination}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">NFTokenID: </Typography>
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Typography variant="s7">{NFTokenID}</Typography>
                                                    </Link>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">URI: </Typography>
                                                    <Typography variant="s7">{convertHexToString(URI)}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">TxMint: </Typography>
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${mintHash}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Typography variant="s7">{mintHash}</Typography>
                                                    </Link>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">offerHash: </Typography>
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${offerHash}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Typography variant="s7">{offerHash}</Typography>
                                                    </Link>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">SellOfferID: </Typography>
                                                    <Typography variant="s7">{SellOfferID}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Status: </Typography>
                                                    <Typography variant="s6">{status} - {statusToString(status)}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Error: </Typography>
                                                    <Typography variant="s6">{JSON.stringify(error)}</Typography>
                                                </Stack>
                                                {(choice === "error" || choice === "nodest") &&
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {resolve ? (
                                                            <Button disabled variant="contained" color="primary" size="small">
                                                                Resolving ...
                                                            </Button>
                                                        ) : (
                                                            <>
                                                                {status === NFToken.PREMINT_E3r1 ?
                                                                    <>
                                                                        <Button variant="contained" color="primary" size="small" onClick={() => handleResolve(row)}>
                                                                            Resolve Again
                                                                        </Button>
                                                                        <Button variant="contained" color="primary" size="small" onClick={() => handleRemove(row)}>
                                                                            Remove
                                                                        </Button>
                                                                    </>
                                                                    :
                                                                    <Button variant="contained" color="primary" size="small" onClick={() => handleResolve(row)}>
                                                                        {status === NFToken.PREOFFER_E2 ? "Set to PREOFFER" : "Resolve"}
                                                                    </Button>
                                                                }
                                                            </>
                                                        )
                                                        }
                                                    </Stack>
                                                }
                                                {choice === "nonftids" &&
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {resolve ? (
                                                            <Button disabled variant="outlined" color="primary" size="small">
                                                                Resolving ...
                                                            </Button>
                                                        ) : (
                                                            <Button variant="outlined" color="primary" size="small" onClick={() => handleResolve(row)}>
                                                                Set as NOT MINTED
                                                            </Button>
                                                        )
                                                        }
                                                    </Stack>
                                                }
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="left">

                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}
