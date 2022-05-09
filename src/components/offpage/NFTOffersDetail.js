import { useState } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ButtonGroup,
    Box,
    Divider,
    Link,
    Skeleton,
    Stack,
    Typography,
    Button,
} from '@mui/material'
import TimePeriods from 'components/OffPage/TimePeriodsDropdown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TimelineIcon from '@mui/icons-material/Timeline'
import ListIcon from '@mui/icons-material/List'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBuyOffer, getSellAndBuyOffers } from 'utils/tokenActions'
import XSnackbar from 'components/common/Snackbar'
import { useSnackbar } from 'hooks/useSnackbar'
import SellOffersList from './SellOffersList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BuyOffersList from './BuyOffersList'
import useSWR from 'swr'
import { NFTOffersDetailProps } from 'utils/types'
import BaseDialog from 'components/dialog/BaseDialog';
import CreateSellOfferDgContent from 'components/dialog/CreateSellOfferDgContent'
import { Icon } from '@iconify/react';
import BurnNFTDgContent from 'components/dialog/BurnNFTDgContent'

NFTOffersDetail.prototype = NFTOffersDetailProps

export default function NFTOffersDetail({ NFTokenID, name }) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const offers = useSWR(NFTokenID, getSellAndBuyOffers)
    const [isOpenSellDg, setIsOpenSellDg] = useState(false)
    const [isOpenBurnDg, setIsOpenBurnDg] = useState(false)

    const [pageLoading, setPageLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const login = useSelector(state => state.account.login)
    const account = useSelector(state => state.account.account)
    const navigate = useNavigate()
    const [owner, setOwner] = useState(null)
    // const [isOwner, setIsOwner] = useState(true)
    const [price, setPrice] = useState(0)

    // const makeSellOffer = async () => {
    //     if (login) {
    //         setLoading(true)
    //         console.log('Making offer...')
    //         try {
    //             await createSellOffer(account.secret, NFTokenID, '20000', 1)
    //             // const res = await createSellOffer(account.secret, NFTokenID, '20000', 1)
    //             // const lastIndex = res.sellOffers.result.offers.length - 1
    //             // setPrice(+res.sellOffers.result.offers[lastIndex].amount / 10 ** 6)
    //             openSnackbar('Offer succeed!', 'success')
    //         } catch (e) {
    //             openSnackbar(e.message, 'error')

    //         }
    //         setLoading(false)
    //     } else {
    //         openSnackbar('You have to log in first!', 'error')
    //         // navigate('/login')
    //     }
    // }

    const makeBuyOffer = async () => {
        if (login) {
            setLoading(true)
            console.log('Making offer...')
            try {
                const res = await createBuyOffer(account.secret, NFTokenID, '1000', 0, owner)
                // setOffers(res.buyOffers.result)
                openSnackbar('Offer succeed!', 'success')
            } catch (e) {
                openSnackbar(e.message, 'error')
            }
            setLoading(false)
        } else {
            openSnackbar('You have to login first to make an offer.', 'error')
            // navigate('/login')
        }
    }

    const fetchListingAndOffers = async (mounted) => {
        setPageLoading(true)
        try {
            const res = await getSellAndBuyOffers(NFTokenID)
            if (mounted) {
                if (res.sellOffers || res.buyOffers) {
                    if (res.sellOffers) {
                        // if it has sell offers, then the last offer owner is the owner of nft
                        setOwner(res.sellOffers.result.offers[0].owner)
                        // setSellOffers(res.sellOffers.result)
                        // the price of nft is from the offer
                        setPrice(+res.sellOffers.result.offers[0].amount / 10 ** 6)
                    }
                    if (res.buyOffers) {// in case no sell offer
                        // setOffers(res.buyOffers.result)
                        // setOwner(getIssuer(NFTokenID))
                    }
                }
                // else setOwner(getIssuer(NFTokenID))
            }
        } catch (e) {
            // console.log(e)
            openSnackbar(e.message, 'error')
        }
        setPageLoading(false)
    }

    return (
        <div>
            <Stack spacing={2} marginTop={1}>
                <Link underline='none' color={'text.primary'}>
                    Name
                </Link>
                <Typography variant='subtitle' gutterBottom fontSize={30} overflow='hidden' fontWeight={600}>
                    {name ? name : 'Unknown'}
                </Typography>
                <Stack spacing={1}>
                    <Typography variant='subtitle1' >
                        Owner
                    </Typography>
                    {
                        !pageLoading ?
                            <Link href='#' underline='none' variant='info'>
                                {owner ? owner : 'Unknown'}
                            </Link> :
                            <Skeleton animation='wave' height={40} width='100%' />
                    }
                </Stack>
            </Stack>

            {/* Make offer start */}
            <Accordion expanded={true} >
                <AccordionSummary
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                >
                    Make Offer
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{ justifyContent: 'space-between', display: 'flex' }}>
                    <ButtonGroup disableElevation variant='outlined' >
                        <Button
                            sx={{ borderRadius: 10 }}
                            loading={loading}
                            loadingPosition='start'
                            variant='outlined'
                            startIcon={<LocalOfferIcon />}
                            onClick={() => setIsOpenSellDg(true)}
                            // disabled={account.key !== owner || owner === null}
                            disabled={!login}
                        >
                            Sell
                        </Button>
                        <Button
                            sx={{ borderRadius: 10 }}
                            loading={loading}
                            loadingPosition='start'
                            variant='outlined'
                            onClick={makeBuyOffer}
                            // disabled={account.key === owner || owner === null}
                            disabled={!login}
                            startIcon={<AccountBalanceWalletIcon />}>
                            Buy
                        </Button>
                    </ButtonGroup>
                    <Button
                        variant='outlined'
                        color='warning'
                        startIcon={<Icon icon='ps:feedburner' />}
                        onClick={() => setIsOpenBurnDg(true)}
                    >
                        Burn
                    </Button>
                </AccordionDetails>
            </Accordion>
            {/* Make offer end */}

            {/* Sell Offers start */}
            <Accordion >
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
                    {
                        offers.error ? <Typography>Error: {offers.error.message}</Typography> :
                            !offers.data ? <Skeleton animation='wave' height={100} width='100%' /> :
                             offers.data.sellOffers ?
                                <SellOffersList
                                    id={offers.data.sellOffers.id}
                                    result={offers.data.sellOffers.result}
                                    NFTokenID={NFTokenID}
                                />:
                                <Typography variant='string'>
                                    No sell offers yet!
                                </Typography>

                    }
                </AccordionDetails>
            </Accordion>
            {/* Sell Offers end */}

            {/* Buy Offers start */}
            <Accordion >
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
                    {
                        offers.error ? <Typography>Error: {offers.error.message}</Typography> :
                            !offers.data ? <Skeleton animation='wave' height={100} width='100%' /> :
                                <BuyOffersList id={offers.data.buyOffers?.id} result={offers.data.buyOffers?.result} />
                    }
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

            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
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
                        NFTokenID={NFTokenID}
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
                        NFTokenID={NFTokenID}
                    />}
            />
        </div>
    )
}

