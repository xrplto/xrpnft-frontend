import { useState, useEffect } from 'react';

// Material
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Link,
    Stack,
    Typography,
    Button,
    Paper,
    Box,
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Utils
import { NFToken, getMinterName } from "src/utils/constants";

// Components
import CreateOfferDialog from './CreateOfferDialog';

import OffersList from './OffersList';

import BurnNFT from './BurnNFT';

// const NFT_FLAGS = {
//     0x00000001: 'lsfBurnable',
//     0x00000002: 'lsfOnlyXRP',
//     0x00000004: 'lsfTrustLine',
//     0x00000008: 'lsfTransferable',
// }

export default function NFTActions({ nft }) {
    const {
        uuid,
        name,
        collection,
        flag,
        type,
        account,
        minter,
        issuer,
        date,
        meta,
        URI,
        status,
        cost,
        destination,
        NFTokenID
    } = nft;

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const accountLogin = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const isOwner = accountLogin === account;
    const isBurnable = (flag & 0x00000001) > 0;

    const [openCreateOffer, setOpenCreateOffer] = useState(false);
    const [isSellOffer, setIsSellOffer] = useState(false);
    
    const [burnt, setBurnt] = useState(status === NFToken.BURNT);

    const handleCreateSellOffer = () => {
        setIsSellOffer(true);
        setOpenCreateOffer(true);
    }

    const handleCreateBuyOffer = () => {
        setIsSellOffer(false);
        setOpenCreateOffer(true);
    }

    const onHandleBurn = () => {
        setBurnt(true);
    }

    return (
        <Stack spacing={2}>
            <CreateOfferDialog
                open={openCreateOffer}
                setOpen={setOpenCreateOffer}
                nft={nft}
                isSellOffer={isSellOffer}
            />
            <Stack spacing={2} sx={{mt:2}}>
                {/* <Link underline='none' color={'text.primary'}>
                    Name
                </Link> */}
                <Typography variant='subtitle' gutterBottom fontSize={30} overflow='hidden' fontWeight={600}>
                    {name}
                </Typography>
            </Stack>

            {/* Make offer start */}
            <Paper sx={{
                padding: 2,
            }}>
                {burnt ?
                    <Typography variant="s5">This NFT is burnt.</Typography>
                :
                    <>
                        {destination && getMinterName(account) ? (
                        <>
                            {destination === accountLogin?
                                <Typography variant="s5">This NFT is being transferred to you. Click <CheckCircleOutlineIcon color='success'/> to accept it.</Typography>
                                :
                                <Typography variant="s5">This NFT is being transferred to &nbsp;
                                    <Link
                                        color="inherit"
                                        target="_blank"
                                        href={`https://bithomp.com/explorer/${destination}`}
                                        rel="noreferrer noopener nofollow"
                                    >
                                        <Typography variant="s3" color="#33C2FF">{destination}</Typography>
                                    </Link>.
                                </Typography>
                            }
                        </>
                        ):(
                            isOwner ? (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}>
                                    <Button
                                        sx={{ borderRadius: 10, width: 200 }}
                                        variant='outlined'
                                        startIcon={<LocalOfferIcon />}
                                        onClick={handleCreateSellOffer}
                                        color='success'
                                        disabled={!accountLogin || burnt}
                                    >
                                        Sell NFT
                                    </Button>
                                    <BurnNFT nft={nft} onHandleBurn={onHandleBurn} />
                                </Box>
                            ):(
                                <Button
                                    sx={{ borderRadius: 10 }}
                                    disabled={!accountLogin || burnt}
                                    variant='outlined'
                                    onClick={handleCreateBuyOffer}
                                    startIcon={<LocalOfferIcon />}
                                >
                                    Buy NFT
                                </Button>
                            )
                        )}
                    </>
                }
                
            </Paper>
            {/* /* Make offer end */}

            {/* Sell Offers start */}
            <Stack>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel3a-content'
                        id='panel3a-header'
                    >
                        <Stack direction='row' spacing={2}>
                            <LocalOfferIcon />
                            <Typography variant='string' >Sell Offers</Typography>
                        </Stack>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails sx={{ textAlign: 'center' }}>
                        <OffersList nft={nft} isSell={true} />
                    </AccordionDetails>
                </Accordion>
                {/* Sell Offers end */}

                {/* Buy Offers start */}
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel3a-content'
                        id='panel3a-header'
                    >
                        <Stack direction='row' spacing={2}>
                            <ListIcon />
                            <Typography variant='string' >Buy Offers</Typography>
                        </Stack>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails sx={{ textAlign: 'center' }}>
                        <OffersList nft={nft} isSell={false} />
                    </AccordionDetails>
                </Accordion>
                {/* Buy Offers end */}
            </Stack>
        </Stack>
    )
}

