import axios from 'axios';
import { useEffect, useState } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Decimal from 'decimal.js';

// Material
import {
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArticleIcon from '@mui/icons-material/Article';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Iconify
import { Icon } from '@iconify/react';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import NFTPreview from './NFTPreview';
import FlagsContainer from 'src/components/Flags';
import Properties from './Properties';
import Levels from 'src/minting/NFTLevels/Levels';
import { convertHexToString, parseNFTokenID } from 'src/utils/parse';

export default function NFTDetails({nft}) {

    const { accountProfile, openSnackbar } = useContext(AppContext);

    const { // {account, NFTokenID, URI, hash, time}
        account,
        NFTokenID,
        URI,
        hash,
        time
    } = nft;

    const ParsedURI = convertHexToString(URI);
    const hrefURI = `https://gateway.xrpnft.com/ipfs/${ParsedURI}`;

    const ParsedID = parseNFTokenID(NFTokenID);
    const flag = ParsedID.flag;
    const royalty = ParsedID.royalty;
    const issuer = ParsedID.issuer;
    const taxon = ParsedID.taxon;

    let transferFee = 0;
    try {
        if (royalty)
            transferFee = Decimal.div(royalty, '1000').toDP(3, Decimal.ROUND_DOWN).toNumber();
    } catch (e) {}

    let strDateTime = '';
    if (time) {
        const dt = new Date(time); // .toLocaleDateString().split('.')[0].replace('T', ' ')
        const strDate = dt.toLocaleDateString();
        const strTime = dt.toLocaleTimeString();
        strDateTime = `${strDate} ${strTime}`;
    }

    return (
        <Stack spacing={2} sx={{mt: 2}}>
            <Stack>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Stack spacing={2} direction='row'>
                            <ArticleIcon />
                            <Typography variant='string'>Details</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="caption">Flags</Typography>
                            <FlagsContainer Flags={flag}/>
                            <Typography variant="s6">{strDateTime}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={2} sx={{mt: 2}}>
                            <Typography variant="caption">Taxon</Typography>
                            <Typography variant="s6">{taxon}</Typography>
                            <Typography variant="caption">Transfer Fee</Typography>
                            <Typography variant="s6">{transferFee} %</Typography>
                        </Stack>

                        <Divider sx={{mt:2, mb:2}}/>

                        <Stack spacing={1}>
                            <Typography variant="caption">Owner</Typography>
                            <Stack direction="row" spacing={0.2} alignItems="center" sx={{display: 'inline-flex', overflowWrap: 'anywhere' }}>
                                <Link
                                    href={`/account/${account}`}
                                    underline='hover'
                                    // target="_blank"
                                    variant='info'
                                    // rel="noreferrer noopener nofollow"
                                >
                                    <Typography sx={{ml:1}}>{account}</Typography>
                                </Link>
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
                        <Divider sx={{mt:2, mb:2}}/>

                        <Stack spacing={1}>
                            <Typography variant="caption">Issuer</Typography>
                            <Stack direction="row" spacing={0.2} alignItems="center" sx={{display: 'inline-flex', overflowWrap: 'anywhere' }}>
                                <Link
                                    href={`/account/${issuer}`}
                                    underline='hover'
                                    // target="_blank"
                                    variant='info'
                                    // rel="noreferrer noopener nofollow"
                                >
                                    <Typography sx={{ml:1}}>{issuer}</Typography>
                                </Link>
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
                                <CopyToClipboard text={issuer} onCopy={()=>openSnackbar('Copied!', 'success')}>
                                    <Tooltip title='Click to copy'>
                                        <IconButton size="small">
                                            <ContentCopyIcon fontSize="small" sx={{ width: 16, height: 16 }}/>
                                        </IconButton>
                                    </Tooltip>
                                </CopyToClipboard>
                            </Stack>
                        </Stack>
                        <Divider sx={{mt:2, mb:2}}/>

                        <Stack spacing={1}>
                            <Typography variant="caption">NFTokenID</Typography>
                            <Link
                                href={`https://bithomp.com/explorer/${NFTokenID}`}
                                target='_blank'
                                variant='info'
                                rel="noreferrer noopener nofollow"
                            >
                                <Typography
                                    sx={{ml:1}}
                                    style={{ wordWrap: "break-word" }}
                                >
                                    {NFTokenID}
                                </Typography>
                            </Link>
                        </Stack>
                        
                        <Stack spacing={1} mt={1}>
                            <Typography variant='caption'>URI</Typography>
                            <Link
                                href={hrefURI}
                                sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                                underline='hover'
                                target="_blank"
                                variant='info'
                                rel="noreferrer noopener nofollow"
                            >
                                <Typography sx={{ml:1}}>{ParsedURI}</Typography>
                            </Link>
                        </Stack>
                        <Divider sx={{mt:2, mb:2}}/>
                    </AccordionDetails>
                </Accordion>

            </Stack>
        </Stack>
    );
}
