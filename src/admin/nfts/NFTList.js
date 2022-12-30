import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";
import {CopyToClipboard} from 'react-copy-to-clipboard';

// Material
import {
    useTheme,
    Avatar,
    Box,
    CardMedia,
    IconButton,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { NFToken } from 'src/utils/constants';
import { formatDateTime } from 'src/utils/formatTime';

// Components
import ListToolbar from '../ListToolbar';
import FlagsContainer from 'src/components/Flags';
// ----------------------------------------------------------------------

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

function statusToString(status) {

    for (const [key, value] of Object.entries(NFToken)) {
        if (value === status)
            return key;
    }
    return 'NONE';
    // switch (status) {
    //     case NFToken
    // }
}

/**
 * Converts hex to its string equivalent. Useful to read the Domain field and some Memos.
 *
 * @param hex - The hex to convert to a string.
 * @param encoding - The encoding to use. Defaults to 'utf8' (UTF-8). 'ascii' is also allowed.
 * @returns The converted string.
 * @category Utilities
 */
 function convertHexToString(hex, encoding = 'utf8') {
    let ret = '';
    try {
        ret = Buffer.from(hex, 'hex').toString(encoding);
    } catch (err) {
    }
    return ret;
}

export default function NFTList({account, filter, choice, setLoading}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountAdmin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        function getNfts() {
            if (!accountAdmin || !accountToken) {
                openSnackbar('Please login', 'error');
                return;
            }
            setLoading(true);

            const body = { account, filter, choice };

            axios.post(`${BASE_URL}/admin/nfts?page=${page}&limit=${rows}`, body, {headers: {'x-access-account': accountAdmin, 'x-access-token': accountToken}})
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setNfts(ret.nfts);
                    }
                }).catch(err => {
                    console.log("Error on getting nfts list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getNfts();
    }, [page, rows, account, accountAdmin, accountToken, filter, choice]);

    return (
        <>
            {nfts && nfts.length === 0 &&
                <Stack alignItems="center" sx={{mt: 5}}>
                    <Typography variant="s7">No Items</Typography>
                </Stack>
            }

            {total > 0 &&
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
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
                                flag,
                                account,
                                date,
                                destination,
                                URI,
                                NFTokenID,
                                mintHash,
                                offerHash,
                                status,
                                error,
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
                                    <TableCell align="left">
                                        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                            {/* {isVideo?
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
                                            } */}
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="h3" color="#33C2FF">{name}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s4">UUID: </Typography>
                                                    <Typography variant="s6">{uuid}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s4">Account: </Typography>
                                                    <Stack direction="row" spacing={0.2} alignItems="center">
                                                        <Typography variant="s6">{account}</Typography>
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
                                                        <CopyToClipboard text={account} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                                            <Tooltip title='Click to copy'>
                                                                <IconButton size="small">
                                                                    <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>
                                                </Stack>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s4">Collection: </Typography>
                                                    <Typography variant="s6">{collection}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s4">Date: </Typography>
                                                    <Typography variant="s6">{strDateTime}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography variant="s4">Flags: </Typography>
                                                    <FlagsContainer Flags={flag}/>
                                                    {/* <Typography variant="s6">{strDateTime}</Typography> */}
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                        <Stack spacing={0.5}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">Destination: </Typography>
                                                <Typography variant="s6">{destination}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">TokenID: </Typography>
                                                <Link
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="s6">{NFTokenID}</Typography>
                                                </Link>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">URI(string): </Typography>
                                                <Typography variant="s6">{convertHexToString(URI)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">URI(hex): </Typography>
                                                <Typography variant="s6">{URI}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">TxMint: </Typography>
                                                <Link
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://bithomp.com/explorer/${mintHash}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="s6">{mintHash}</Typography>
                                                </Link>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">offerHash: </Typography>
                                                <Link
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://bithomp.com/explorer/${offerHash}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="s6">{offerHash}</Typography>
                                                </Link>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">SellOfferID: </Typography>
                                                <Typography variant="s6">{SellOfferID}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">Status: </Typography>
                                                <Typography variant="s6">{status} - {statusToString(status)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">Error: </Typography>
                                                <Typography variant="s6">{JSON.stringify(error)}</Typography>
                                            </Stack>
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
