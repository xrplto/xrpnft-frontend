import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Container,
    Grid,
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
import Trait from 'components/miniting/NFTProperties/Trait';
import { NFTDetailsProps } from 'utils/types';
import FlagsContainer from 'components/NFTCard/Flags';
import NFTDetailsDescription from './NftDetailsDescription';


const properties = [
    {
        id: 1,
        type: 'head',
        value: 'gold',
    },
    {
        id: 2,
        type: 'arms',
        value: 'thin',
    },
]

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
                <NFTPreview uri={data.image} title='Test title' favorites={0} />
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

            {/* NFT Properties start--- */}
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
                    <Container>
                        <Grid container spacing={2} >
                            {properties.map((property) => (
                                <Grid item key={property.id}>
                                    <Trait type={property.type} value={property.value} />
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </AccordionDetails>
            </Accordion>
            {/* NFT Properties end--- */}
        </Box>
    );
}
