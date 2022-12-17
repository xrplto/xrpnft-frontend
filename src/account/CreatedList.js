import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";

// Material
import {
    useTheme,
    Box,
    CardMedia,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";

// Utils
import { formatDateTime } from 'src/utils/formatTime';
import { parseNFTokenID } from 'src/utils/parse';

// Loader
import { PulseLoader } from "react-spinners";

// Components
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';

// ----------------------------------------------------------------------
export default function CreatedList({account}) {
    const theme = useTheme();
    const BASE_URL = 'https://api.xrpnft.com/api';

    // const { accountProfile, openSnackbar, setAcceptNfts } = useContext(AppContext);
    // const account = accountProfile?.account;
    // const accountToken = accountProfile?.token;
    
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(10);
    const [total, setTotal] = useState(0);
    const [nfts, setNfts] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function getNfts() {
            setLoading(true);
            axios.get(`${BASE_URL}/account/created?account=${account}&page=${page}&limit=${rows}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setNfts(ret.nfts);
                    }
                }).catch(err => {
                    console.log("Error on getting created nfts list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        getNfts();
    }, [account, page, rows]);

    return (
        <>
            {loading ? (
                <Stack alignItems="center">
                    <PulseLoader color='#00AB55' size={10} />
                </Stack>
            ):(
                nfts && nfts.length === 0 &&
                    <Stack alignItems="center" sx={{mt: 5}}>
                        <Typography variant="s7">No Items</Typography>
                    </Stack>
            )
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
                                account,
                                date,
                                meta,
                                URI,
                                NFTokenID
                            } = row;

                            const {
                                flag,
                                royalty,
                                issuer,
                                taxon,
                                transferFee
                            } = parseNFTokenID(NFTokenID);
                        
                            const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image||meta.video}`;
                            const isVideo = meta.video;

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
                                            {isVideo?
                                                <CardMedia
                                                    component="video"
                                                    image={imgUrl}
                                                    title='title'
                                                    controls
                                                    style={{
                                                        width: 128,
                                                        height: 128,
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
                                                        width: 128,
                                                        height: 128,
                                                        filter: `drop-shadow(16px 16px 10px rgba(0,0,0,0.8))`
                                                    }}
                                                />
                                            }
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Link href={`/assets/${uuid}`} underline="none">
                                                        <Typography variant="h3" color="#33C2FF">{name}</Typography>
                                                    </Link>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Collection: </Typography>
                                                    <Typography variant="s6">{collection}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">Created On: </Typography>
                                                    <Typography variant="s6">{strDateTime}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Typography variant="s7">Flags: </Typography>
                                                    <FlagsContainer Flags={flag}/>
                                                    {/* <Typography variant="s6">{strDateTime}</Typography> */}
                                                    <Typography variant='s7'>Taxon </Typography>
                                                    <Typography variant='s6'>{taxon}</Typography>
                                                    <Typography variant="s7">Transfer Fee</Typography>
                                                    <Typography variant="s6">{transferFee} %</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="s7">NFTokenID: </Typography>
                                                    <Link
                                                        color="inherit"
                                                        target="_blank"
                                                        href={`https://bithomp.com/explorer/${NFTokenID}`}
                                                        rel="noreferrer noopener nofollow"
                                                    >
                                                        <Typography variant="s6">{NFTokenID}</Typography>
                                                    </Link>
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                    </TableBody>
                </Table>
            </Box>
            { total > 0 &&
                <ListToolbar
                    count={total}
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                />
            }
        </>
    );
}
