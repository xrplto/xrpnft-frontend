import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Link,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Stack,
    Typography,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArticleIcon from '@mui/icons-material/Article';
import { Icon } from '@iconify/react';
import NFTPreview from './NFTPreview';
import { NFTDetailsProps } from 'utils/types';
import FlagsContainer from 'components/NFTCard/Flags';
import NFTDetailsDescription from './NftDetailsDescription';
import Properties from 'components/miniting/NFTProperties/Properties';
import Levels from 'components/miniting/NFTLevels/Levels';


NFTDetails.propTypes = NFTDetailsProps

export default function NFTDetails({
    NFTokenID,
    NFToken,
    ParsedURI,
    data
}) {

    return (
        <Box >
            {/* NFT Preview image start--- */}
            {data.image &&
                <NFTPreview uri={data.image} title={data.description?.name} favorites={0} />
            }
            {/* NFT Preview image end--- */}

            {/* NFT Detail info start--- */}
            <Accordion sx={{ marginTop: 2 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel3a-content'
                    id='panel3a-header'
                >
                    <Stack spacing={2} direction='row'>
                        <ArticleIcon />
                        <Typography variant='string' >Details</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        overflow: 'hidden'
                    }}
                >
                    <List>
                        <ListItem disablePadding>
                            <ListSubheader>
                                TokenId
                            </ListSubheader>
                            <ListItemText primary={NFTokenID} />
                        </ListItem>
                        <ListItem disablePadding >
                            <ListSubheader>
                                Flags
                            </ListSubheader>
                            <FlagsContainer Flags={NFToken.flags} />
                        </ListItem>
                        <ListItem disablePadding disableGutters >
                            <ListSubheader>
                                Issuer
                            </ListSubheader>
                            <ListItemText >
                                <Link
                                    underline='hover'
                                    href='#'
                                    variant='info'
                                    sx={{ marginRight: 0, overflowWrap: 'anywhere' }}
                                >
                                    {NFToken.issuer}
                                </Link>
                            </ListItemText>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                Transfer Fee
                            </ListSubheader>
                            <ListItemText primary={NFToken.transferFee} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                Taxon
                            </ListSubheader>
                            <ListItemText primary={NFToken.tokenTaxon} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                Sequence
                            </ListSubheader>
                            <ListItemText primary={NFToken.sequence} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                URI
                            </ListSubheader>
                            {/* <ListItemText primary={ParsedURI} /> */}
                            <ListItemText >
                                <Link underline='hover'
                                    href={ParsedURI}
                                    variant='info'
                                    id='uri-link'
                                    sx={{ marginRight: 0, overflowWrap: 'anywhere' }}
                                >
                                    {ParsedURI}
                                </Link>
                            </ListItemText>
                        </ListItem>
                    </List>
                </AccordionDetails>
            </Accordion>
            {/* NFT Detail info end--- */}


            {/* NFT Properties start--- */}
            {
                data.description?.properties &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel2a-content'
                        id='panel2a-header'
                    >
                        <Stack spacing={2} direction='row'>
                            <Icon icon='majesticons:checkbox-list-detail-line' fontSize={25} />
                            {/* <MoreIcon /> */}
                            <Typography variant='string' >Properties</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Properties properties={data.description?.properties} />
                    </AccordionDetails>
                </Accordion>
            }
            {/* NFT Properties end--- */}

            {/* NFT Leveled Properties start--- */}
            {
                data.description?.levels &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel2a-content'
                        id='panel2a-header'
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

            {/* NFT Description start--- */}
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='description-content'
                    id='description-header'
                >
                    <Stack spacing={2} direction='row'>
                        <DescriptionIcon />
                        <Typography variant='string' >Description</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ overflow: 'auto' }}>
                    {
                        <NFTDetailsDescription description={data.description} />
                    }
                </AccordionDetails>
            </Accordion>
            {/* NFT Description end--- */}

        </Box>
    );
}
