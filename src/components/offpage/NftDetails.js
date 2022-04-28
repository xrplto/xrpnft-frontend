import { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Container,
    Divider,
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
import { parseNFT, parseNFTUri, getNFTMetadata, parseNFTokenId, parseURI } from 'utils/utils';
import Trait from 'components/miniting/NFTProperties/Trait';


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

export default function NFTDetails({ tokenID, URI }) {
    const [imgUri, setImgUri] = useState('')
    const nft = parseNFTokenId(tokenID)
    const uri = parseNFTUri(URI)

    useEffect(() => {
        if (uri)
            setImgUri(uri.main)
    }, [])

    return (
        <Box >
            {/* NFT Previe image start--- */}
            {imgUri &&
                <NFTPreview uri={imgUri} title='Test title' favorites={0} />
            }
            {/* NFT Previe image end--- */}

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
                            <ListItemText primary={tokenID} />
                        </ListItem>
                        <ListItem disablePadding >
                            <ListSubheader>
                                Flags
                            </ListSubheader>
                            <Stack
                                direction='row'
                                spacing={1}
                                sx={{ fontSize: 20, gap: 2 }}
                                divider={<Divider orientation='vertical' flexItem />}>
                                {nft.flags.tfBurnable && <Icon icon='ps:feedburner' />}
                                {nft.flags.tfOnlyXRP && <Icon icon='teenyicons:ripple-solid' />}
                                {nft.flags.tfTrustLine && <Icon icon='codicon:workspace-trusted' />}
                                {nft.flags.tfTransferable && <Icon icon='mdi:transit-transfer' />}
                                {nft.flags.tfNoFlag && <Icon icon='carbon:not-available' />}
                            </Stack>
                        </ListItem>
                        <ListItem disablePadding disableGutters >
                            <ListSubheader>
                                Issuer
                            </ListSubheader>
                            <Link underline='none'
                                href='#'
                                variant='info'
                                sx={{ marginRight: 0, overflowWrap: 'anywhere' }}
                            >
                                {nft.issuer}
                            </Link>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                Transfer Fee
                            </ListSubheader>
                            <ListItemText primary={nft.transferFee} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                Taxon
                            </ListSubheader>
                            <ListItemText primary={nft.tokenTaxon} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                Sequence
                            </ListSubheader>
                            <ListItemText primary={nft.sequence} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListSubheader>
                                URI
                            </ListSubheader>
                            <ListItemText primary={JSON.stringify(uri)} />
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
                <AccordionDetails sx={{ maxHeight: 250, overflow: 'auto' }}>
                    <Typography variant='string' gutterBottom>
                        Elite residential complex in Batumi (Georgia) at the excavation stage. Housing delivery is scheduled for January 3, 2024. Now you have the option of buying with cryptocurrency in the form of NFT
                        Our NFTs are tied to a real object. You get the title to the property (apartment, office, parking space). Each apartment is divided into NFTs = 1 nft = 1 sq.m. Let's say an apartment of 140 sq.m. consists of 140 NFTs. You can also buy the whole apartment, but unfortunately it will take time for us to prepare the documentation. The house is real, now at the stage of excavation in Georgia. The price of an apartment in Opensea is equal to 2/3 of the price of an apartment in Georgia. This is done so that we are counting on the % of repeat sales to cover the costs. If you are a citizen of Georgia, you can buy an apartment for Lari (GEL). There will be NFT staking, marketplace, and a lot of interesting things coming soon. - You will all be owners of this apartment. This NFT can then be put into a staking and receive rewards. It will also give airdrops and grow in value in the future. You can also fully buy the entire apartment - and you will own it. A completely real apartment.
                    </Typography>
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
