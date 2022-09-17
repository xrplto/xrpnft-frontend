import { useState, useEffect } from 'react';

// Material
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    Skeleton,
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

// Redux
import { useSelector } from 'react-redux';

// Iconify
import { Icon } from '@iconify/react';

// Utils
import { getSellAndBuyOffers } from 'src/utils/tokenActions';

// Components
import BaseDialog from 'src/components/dialog/BaseDialog';
import CreateSellOfferDgContent from 'src/components/dialog/CreateSellOfferDgContent';
import BurnNFTDgContent from 'src/components/dialog/BurnNFTDgContent';
import CreateBuyOfferDgContent from 'src/components/dialog/CreateBuyOfferDgContent';

import TimePeriods from './TimePeriodsDropdown';
import SellOffersList from './SellOffersList';
import BuyOffersList from './BuyOffersList';

export default function NFTActions({ token }) {
    const {
        name,
        image,
        uuid,
        description,
        collection,
        Issuer,
        TokenID,
        URI,
        Flags,
        properties,
        levels
    } = token;

    const [isOpenSellDg, setIsOpenSellDg] = useState(false);
    const [isOpenBuyDg, setIsOpenBuyDg] = useState(false);
    const [isOpenBurnDg, setIsOpenBurnDg] = useState(false);
    const account_nfts = []; // useSelector(state => state.account.nfts);
    console.log("account nfts", account_nfts);

    const isOwner = false; // account_nfts.findIndex((nft) => nft.TokenID === TokenID) > -1;

    const login = false; // useSelector(state => state.account.login);
    const [isPageLoading, setPageLoading] = useState(false);
    const [sellOffers, setSellOffers] = useState([]);
    const [buyOffers, setBuyOffers] = useState([]);
    const [owner, setOwner] = useState('');

    

    const fetchOffers = async (mounted) => {
        // setPageLoading(true)
        // try {
        //     const res = await getSellAndBuyOffers(TokenID)
        //     if (mounted) {
        //         console.log({ res })
        //         setBuyOffers(res.buyOffers)
        //         setSellOffers(res.sellOffers)
        //         if (res.sellOffers.length) {
        //             const owner = res.sellOffers[0].owner
        //             setOwner(owner)
        //         }
        //         else if(res.sellOffers.length===0) {
        //             console.log('No sell Offer.')
        //             const owner = Issuer
        //             setOwner(owner)
        //         }
        //     }
        // } catch (e) {
        //     console.log(e)
        //     // openSnackbar(e.message, 'error')
        // }
        // setPageLoading(false)
    }

    useEffect(() => {
        let mounted = true
        // fetchOffers(mounted)

        return () => {
            mounted = false
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // console.log("owner", TokenID)
    return (
        <Stack spacing={2}>
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
                {
                    isOwner ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-around'
                        }}>
                            <Button
                                sx={{ borderRadius: 10, width: 200 }}
                                variant='outlined'
                                startIcon={<LocalOfferIcon />}
                                onClick={() => setIsOpenSellDg(true)}
                                color='success'
                                disabled={!login}
                            >
                                Sell
                            </Button>
                            <Button
                                variant='outlined'
                                sx={{ borderRadius: 10, width: 200 }}
                                color='warning'
                                startIcon={<Icon icon='ps:feedburner' />}
                                onClick={() => setIsOpenBurnDg(false)}
                                disabled={!isOwner || !login} // you cannot burn NFToken if you are not owner
                            >
                                Burn
                            </Button>
                        </Box>
                    ):(
                        <Button
                            sx={{ borderRadius: 10 }}
                            disabled={!login}
                            variant='outlined'
                            // onClick={makeBuyOffer}
                            onClick={() => setIsOpenBuyDg(false)}
                            startIcon={<LocalOfferIcon />}
                        >
                            Best offer
                        </Button>
                    )
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
                    <AccordionDetails sx={{ margin: 3, textAlign: 'center' }}>
                        {/* {
                            offers.error ? <Typography>Error: {offers.error.message}</Typography> :
                                !offers.data ? <Skeleton animation='wave' height={100} width='100%' /> :
                                    offers.data.sellOffers ?
                                        <SellOffersList
                                            id={offers.data.sellOffers.id}
                                            result={offers.data.sellOffers.result}
                                            TokenID={TokenID}
                                            isOwner={isOwner}
                                        /> :
                                        <Typography variant='string'>
                                            No sell offers yet!
                                        </Typography>

                        } */}
                        {isPageLoading ?
                            <Skeleton animation='wave' height={100} width='100%' />
                            :
                            <SellOffersList
                                _offers={sellOffers}
                                _TokenID={TokenID}
                                _isOwner={isOwner}
                            />
                        }
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
                    <AccordionDetails sx={{ margin: 3, textAlign: 'center' }}>
                        {isPageLoading ?
                            <Skeleton animation='wave' height={100} width='100%' />
                            :
                            <BuyOffersList
                                _offers={buyOffers}
                                _TokenID={TokenID}
                                _isOwner={isOwner}
                            />}
                        {/* {
                            offers.error ? <Typography>Error: {offers.error.message}</Typography> :
                                !offers.data ? <Skeleton animation='wave' height={100} width='100%' /> :
                                    <BuyOffersList id={offers.data.buyOffers?.id} result={offers.data.buyOffers?.result} isOwner={isOwner} />
                        } */}
                    </AccordionDetails>
                </Accordion>
                {/* Buy Offers end */}


                {/* Price History Start */}
                <Accordion defaultExpanded >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel2a-content'
                        id='panel2a-header'
                    >
                        <Stack direction='row' spacing={2}>
                            <TimelineIcon />
                            <Typography variant='string' >Price History</Typography>
                        </Stack>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails>
                        <TimePeriods />
                        {/* <img src={activity} /> */}
                        <Typography sx={{ margin: 3, textAlign: 'center' }}>
                            No item activity yet
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                {/* Price History end */}
            </Stack>

            <BaseDialog
                isOpen={isOpenSellDg}
                close={() => {
                    setIsOpenSellDg(false)
                }}
                title={'Create Sell Offer'}
                render={
                    <CreateSellOfferDgContent
                        close={() => {
                            setIsOpenSellDg(false)
                        }}
                        TokenID={TokenID}
                        setOffers={(offers) => setSellOffers(offers)}
                    />}
            />
            <BaseDialog
                isOpen={isOpenBurnDg}
                close={() => {
                    setIsOpenBurnDg(false)
                }}
                title={'Burn NFT'}
                render={
                    <BurnNFTDgContent
                        close={() => {
                            setIsOpenBurnDg(false)
                        }}
                        TokenID={TokenID}
                    />}
            />
            <BaseDialog
                isOpen={isOpenBuyDg}
                close={() => {
                    setIsOpenBuyDg(false)
                }}
                title={'Make Buy Offer'}
                render={
                    <CreateBuyOfferDgContent
                        close={() => {
                            setIsOpenBuyDg(false)
                        }}
                        TokenID={TokenID}
                        setOffers={(offers) => setBuyOffers(offers)}
                        owner={owner}
                    />}
            />
        </Stack>
    )
}

