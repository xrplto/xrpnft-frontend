import axios from 'axios';
import { useState, useEffect } from 'react';
import ModalImage from "react-modal-image";

// Material
import {
    useTheme,
    Box,
    Link,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { tableCellClasses } from "@mui/material/TableCell";

// Loader
import { PulseLoader } from "react-spinners";

// Components
import ListToolbar from './ListToolbar';
import FlagsContainer from 'src/components/Flags';
// ----------------------------------------------------------------------

function truncate(str, n) {
    if (!str) return '';
    //return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
    return (str.length > n) ? str.substr(0, n-1) + ' ...' : str;
};

export default function FavoritedList({account}) {
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
            axios.get(`${BASE_URL}/account/favorited?account=${account}&page=${page}&limit=${rows}`)
                .then(res => {
                    let ret = res.status === 200 ? res.data : undefined;
                    if (ret) {
                        setTotal(ret.total);
                        setNfts(ret.nfts);
                    }
                }).catch(err => {
                    console.log("Error on getting minted nfts list!!!", err);
                }).then(function () {
                    // always executed
                    setLoading(false);
                });
        }
        // getNfts();
    }, [account, page, rows]);

    return (
        <Stack spacing={3} alignItems="center">
            <Typography variant="s3" sx={{ mb: 2 }}>Coming Soon</Typography>
            <img
                alt="Coming Soon"
                height={200}
                src="/static/status/coming-soon.svg"
            />
            <Typography variant="s7" sx={{ mb: 4 }}>We're working on implementing this feature, Please contact us if you need this feature urgently!</Typography>
        </Stack>
    );

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
                                flag,
                                account,
                                date,
                                meta,
                                URI,
                                NFTokenID
                            } = row;
                        
                            const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image}`;

                            let strDateTime = '';

                            const nDate = new Date(date);
                            const year = nDate.getFullYear();
                            const month = (nDate.getMonth() + 1).toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                            const day = nDate.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});;
                            const hour = nDate.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                            const min = nDate.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});
                            const sec = nDate.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false});

                            //const strTime = (new Date(date)).toLocaleTimeString('en-US', { hour12: false });
                            //const strTime = nDate.format("YYYY-MM-DD HH:mm:ss");
                            strDateTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
                            // const strTime = `${hour}:${min}:${sec}`;

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
                                    </TableCell>
                                    
                                    <TableCell align="left">
                                        <Stack spacing={0.5}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="h3" color="#33C2FF">{name}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">Collection: </Typography>
                                                <Typography variant="s6">{collection}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">Created On: </Typography>
                                                <Typography variant="s6">{strDateTime}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Typography variant="s4">Flags: </Typography>
                                                <FlagsContainer Flags={flag}/>
                                                {/* <Typography variant="s6">{strDateTime}</Typography> */}
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="s4">TokenID: </Typography>
                                                <Link
                                                    color="inherit"
                                                    target="_blank"
                                                    href={`https://xls20.bithomp.com/explorer/${NFTokenID}`}
                                                    rel="noreferrer noopener nofollow"
                                                >
                                                    <Typography variant="s6">{NFTokenID}</Typography>
                                                </Link>
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
