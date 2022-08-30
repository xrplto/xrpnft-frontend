import axios from 'axios';
import { useEffect, useState } from 'react';

// Material
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Divider,
    Link,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArticleIcon from '@mui/icons-material/Article';

// Iconify
import { Icon } from '@iconify/react';

// Components
import NFTPreview from './NFTPreview';
import NFTDetailsDescription from './NftDetailsDescription';
import FlagsContainer from 'src/explore/Flags';
import Properties from 'src/minting/NFTProperties/Properties';
import Levels from 'src/minting/NFTLevels/Levels';
import { convertHexToString } from 'src/utils/parse';

export default function NFTDetails({token}) {

    const {
        name,
        image,
        uuid,
        description,
        externalLink,
        timestamp,
        collection,
        Issuer,
        TokenID,
        URI,
        Flags,
        properties,
        levels
    } = token;

    const ParsedURI = convertHexToString(URI);
    const hrefURI = `https://ipfs.xrpnft.com/ipfs/${ParsedURI}`;

    let strDateTime = '';
    if (timestamp) {
        const dt = new Date(timestamp); // .toLocaleDateString().split('.')[0].replace('T', ' ')
        const date = dt.toLocaleDateString();
        const time = dt.toLocaleTimeString();
        strDateTime = `${date} ${time}`;
    }
    
    return (
        <Stack spacing={2} sx={{mt: 2}}>
            <NFTPreview image={image} title={name} favorites={0} />
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
                            <Typography variant='caption'>Flags</Typography>
                            <FlagsContainer Flags={Flags}/>
                            <Typography sx={{ml:1}}>{strDateTime}</Typography>
                        </Stack>
                        <Divider sx={{mt:2, mb:2}}/>
                        <Stack spacing={1}>
                            <Typography variant='caption'>Issuer</Typography>
                            <Link
                                href={`https://xls20.bithomp.com/explorer/${Issuer}`}
                                sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                                underline='hover'
                                target="_blank"
                                variant='info'
                                rel="noreferrer noopener nofollow"
                            >
                                <Typography sx={{ml:1}}>{Issuer}</Typography>
                            </Link>
                        </Stack>
                        <Divider sx={{mt:2, mb:2}}/>
                        
                        <Stack spacing={1}>
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

                        {
                            externalLink && (
                                <>
                                    <Stack spacing={1}>
                                        <Typography variant='caption'>Link</Typography>
                                        <Link
                                            href={`${externalLink}`}
                                            sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                                            underline='hover'
                                            target="_blank"
                                            variant='info'
                                            rel="noreferrer noopener nofollow"
                                        >
                                            <Typography sx={{ml:1}}>{externalLink}</Typography>
                                        </Link>
                                    </Stack>
                                    <Divider sx={{mt:2, mb:2}}/>
                                </>
                            )
                        }

                        <Stack spacing={1}>
                            <Typography variant='caption'>Collection</Typography>
                            <Link
                                href={`/collection/${collection}`}
                                sx={{ mt: 1.5, display: 'inline-flex', overflowWrap: 'anywhere' }}
                                underline='hover'
                                target="_blank"
                                variant='info'
                                rel="noreferrer noopener nofollow"
                            >
                                <Typography sx={{ml:1}}>{collection}</Typography>
                            </Link>
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
                        <NFTDetailsDescription description={description} />
                    </AccordionDetails>
                </Accordion>
                {/* NFT Properties start--- */}
                {
                    properties &&
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            id="panel3bh-header"
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                        >
                            <Stack spacing={2} direction='row'>
                                <Icon icon='majesticons:checkbox-list-detail-line' fontSize={25} />
                                {/* <MoreIcon /> */}
                                <Typography variant='string' >Properties</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Properties properties={properties} />
                        </AccordionDetails>
                    </Accordion>
                }
                {/* NFT Properties end--- */}

                {/* NFT Leveled Properties start--- */}
                {
                    levels &&
                    <Accordion defaultExpanded>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Stack spacing={2} direction='row'>
                                <Icon icon='majesticons:checkbox-list-detail-line' fontSize={25} />
                                {/* <MoreIcon /> */}
                                <Typography variant='string' >Level Properties</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Levels levels={data.description?.levels} />
                        </AccordionDetails>
                    </Accordion>
                }
                {/* NFT Leveled Properties end--- */}
            </Stack>
        </Stack>
    );
}
