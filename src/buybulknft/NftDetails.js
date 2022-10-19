import axios from 'axios';
import { useEffect, useState } from 'react';
import Decimal from 'decimal.js';

// Material
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Link,
    Stack,
    Typography,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArticleIcon from '@mui/icons-material/Article';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';

// Components
import NFTPreview from './NFTPreview';
import NFTDetailsDescription from './NftDetailsDescription';
import FlagsContainer from 'src/components/Flags';
import Properties from 'src/minting/NFTProperties/Properties';
import Levels from 'src/minting/NFTLevels/Levels';
import { convertHexToString } from 'src/utils/parse';


export default function NFTDetails({nft}) {

    const {
        uuid,
        name,
        collection,
        flag,
        account,
        date,
        meta,
        URI,
        royalty,
        taxon,
        cslug,
        NFTokenID
    } = nft;

    const imgUrl = `https://gateway.xrpnft.com/ipfs/${meta.image}`;

    const ParsedURI = convertHexToString(URI);
    const hrefURI = `https://gateway.xrpnft.com/ipfs/${ParsedURI}`;

    let strDateTime = '';
    if (date) {
        const dt = new Date(date); // .toLocaleDateString().split('.')[0].replace('T', ' ')
        const strDate = dt.toLocaleDateString();
        const strTime = dt.toLocaleTimeString();
        strDateTime = `${strDate} ${strTime}`;
    }

    let transferFee = 0;
    try {
        if (royalty)
            transferFee = Decimal.div(royalty, '1000').toDP(3, Decimal.ROUND_DOWN).toNumber();
    } catch (e) {}

    const collectionName = collection.name || collection;
    
    return (
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
                        <Typography variant="caption">Issuer</Typography>
                        <Link
                            href={`https://xls20.bithomp.com/explorer/${account}`}
                            sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                            underline='hover'
                            target="_blank"
                            variant='info'
                            rel="noreferrer noopener nofollow"
                        >
                            <Typography sx={{ml:1}}>{account}</Typography>
                        </Link>
                    </Stack>
                    <Divider sx={{mt:2, mb:2}}/>
                    
                    <Stack spacing={1}>
                        <Typography variant="caption">NFTokenID</Typography>
                        <Link
                            href={`https://xls20.bithomp.com/explorer/${NFTokenID}`}
                            target='_blank'
                            variant='info'
                            rel="noreferrer noopener nofollow"
                        >
                            <Typography sx={{ml:1}}>{NFTokenID}</Typography>
                        </Link>
                    </Stack>

                    <Divider sx={{mt:2, mb:2}}/>
                    
                    <Stack spacing={1}>
                        <Typography variant='caption'>URI</Typography>
                        <Link
                            href={hrefURI}
                            sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                            underline='hover'
                            target='_blank'
                            variant='info'
                            rel="noreferrer noopener nofollow"
                        >
                            <Typography sx={{ml:1}}>{ParsedURI}</Typography>
                        </Link>
                    </Stack>
                    <Divider sx={{mt:2, mb:2}}/>

                    {
                        meta.external_link && (
                            <>
                                <Stack spacing={1}>
                                    <Typography variant='caption'>Link</Typography>
                                    <Link
                                        href={`${meta.external_link}`}
                                        sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                                        underline='hover'
                                        target="_blank"
                                        variant='info'
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography sx={{ml:1}}>{meta.external_link}</Typography>
                                    </Link>
                                </Stack>
                                <Divider sx={{mt:2, mb:2}}/>
                            </>
                        )
                    }

                    <Stack spacing={1}>
                        <Typography variant='caption'>Collection</Typography>
                        {cslug ? (
                            <Link href={`/collection/${cslug}`} underline='none'>
                                <Typography sx={{pl:1}}>{collectionName}</Typography>
                            </Link>
                        ):(
                            <Typography sx={{pl:1}}>{collectionName}</Typography>
                        )}
                        
                    </Stack>
                    <Divider sx={{mt:2, mb:2}}/>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Stack spacing={2} direction='row'>
                        <DescriptionIcon />
                        <Typography variant='string' >Description</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <NFTDetailsDescription description={meta.description} />
                </AccordionDetails>
            </Accordion>
            {/* NFT Properties start--- */}
            {/* {properties &&
                <Accordion defaultExpanded>
                    <AccordionSummary
                        id="panel3bh-header"
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                    >
                        <Stack spacing={2} direction='row'>
                            <Icon icon='majesticons:checkbox-list-detail-line' fontSize={25} />
                            <Typography variant='string' >Properties</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Properties properties={properties} />
                    </AccordionDetails>
                </Accordion>
            } */}
            {/* NFT Properties end--- */}

            {/* NFT Leveled Properties start--- */}
            {/* {
                levels &&
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                    >
                        <Stack spacing={2} direction='row'>
                            <Icon icon='majesticons:checkbox-list-detail-line' fontSize={25} />
                            <Typography variant='string' >Level Properties</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Levels levels={data.description?.levels} />
                    </AccordionDetails>
                </Accordion>
            } */}
            {/* NFT Leveled Properties end--- */}
        </Stack>
    );
}
