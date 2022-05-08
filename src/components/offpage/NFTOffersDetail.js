import { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ButtonGroup,
    Divider,
    Link,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import TimePeriods from 'components/OffPage/TimePeriodsDropdown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TimelineIcon from '@mui/icons-material/Timeline'
import { CountdownTimer } from './CountDownTimer'
import ListIcon from '@mui/icons-material/List'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBuyOffer, createSellOffer, getSellAndBuyOffers, getBuyOffers } from 'utils/tokenActions'
import XSnackbar from 'components/common/Snackbar'
import { useSnackbar } from 'hooks/useSnackbar'
import SellOffersList from './SellOffersList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BuyOffersList from './BuyOffersList'
import useSWR from 'swr'
import { NFTOffersDetailProps } from 'utils/types'

NFTOffersDetail.prototype = NFTOffersDetailProps

export default function NFTOffersDetail({ NFTokenID, name }) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const [pageLoading, setPageLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sellOffers, setSellOffers] = useState({})
    const [offers, setOffers] = useState({})
    const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000
    const NOW_IN_MS = new Date().getTime()
    const login = useSelector(state => state.account.login)
    const account = useSelector(state => state.account.account)
    const navigate = useNavigate()
    const [owner, setOwner] = useState(null)
    const [price, setPrice] = useState(0)
    const buyOffers = useSWR(NFTokenID, getBuyOffers)

    const handleSellOffer = async () => {
        if (login) {
            setLoading(true)
            console.log('Making offer...')
            try {
                const res = await createSellOffer(account.secret, NFTokenID, '20000', 1)
                setSellOffers(res.sellOffers.result)
                const lastIndex = res.sellOffers.result.offers.length - 1
                setPrice(+res.sellOffers.result.offers[lastIndex].amount / 10 ** 6)
                openSnackbar('Offer succeed!', 'success')
            } catch (e) {
                openSnackbar(e.message, 'error')

            }
            setLoading(false)
        } else {
            navigate('/login')
        }
    }

    const makeBuyOffer = async () => {
        if (login) {
            setLoading(true)
            console.log('Making offer...')
            try {
                const res = await createBuyOffer(account.secret, NFTokenID, '1000', 0, owner)
                setOffers(res.buyOffers.result)
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
                        setSellOffers(res.sellOffers.result)
                        // the price of nft is from the offer
                        setPrice(+res.sellOffers.result.offers[0].amount / 10 ** 6)
                    }
                    if (res.buyOffers) {// in case no sell offer
                        setOffers(res.buyOffers.result)
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

    // useEffect(() => {
    //     let mounted = true
    //     // fetchListingAndOffers(mounted)
    //     return () => {
    //         mounted = false
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    return (
        <div>
            <Stack spacing={2} marginTop={1}>
                <Link underline='none' color={'text.primary'}>
                    NFTKings
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
            <Accordion expanded={true} >
                <AccordionSummary
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                >
                    <Stack spacing={2}>
                        <Typography>Sale ends {new Date(THREE_DAYS_IN_MS + NOW_IN_MS).toUTCString()}</Typography>
                        <CountdownTimer targetDate={THREE_DAYS_IN_MS + NOW_IN_MS} />
                    </Stack>
                </AccordionSummary>
                <Divider />
                <AccordionDetails >
                    <Typography variant='string'>Current Price</Typography>
                    {
                        !pageLoading ?
                            <Typography variant='h6' gutterBottom margin={2}>
                                {price ? price + 'XRP' : 'Not listed yet!'}
                                <Typography variant='caption'>({(price * 0.7973).toFixed(6)} USD)</Typography>
                            </Typography> :
                            <Skeleton animation='wave' height={40} width='100%' />
                    }
                    <ButtonGroup disableElevation variant='outlined' >
                        <LoadingButton
                            sx={{ borderRadius: 10 }}
                            loading={loading}
                            loadingPosition='start'
                            variant='outlined'
                            startIcon={<LocalOfferIcon />}
                            onClick={handleSellOffer}
                            // disabled={account.key !== owner || owner === null}
                            disabled={!login}
                        >
                            Sell Offer
                        </LoadingButton>
                        <LoadingButton
                            sx={{ borderRadius: 10 }}
                            loading={loading}
                            loadingPosition='start'
                            variant='outlined'
                            onClick={makeBuyOffer}
                            // disabled={account.key === owner || owner === null}
                            disabled={!login}
                            startIcon={<AccountBalanceWalletIcon />}>
                            Buy Offer
                        </LoadingButton>
                    </ButtonGroup>
                </AccordionDetails>
            </Accordion>
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

                        !pageLoading ?
                            sellOffers &&
                            <SellOffersList listings={sellOffers} NFTokenID={NFTokenID} owner={owner} />
                            :
                            <Skeleton animation='wave' height={100} width='100%' />
                    }
                </AccordionDetails>
            </Accordion>
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
                        buyOffers.error ? <Typography>Error: {buyOffers.error.message}</Typography> :
                            !buyOffers.data ? <Skeleton animation='wave' height={100} width='100%' /> :
                                <BuyOffersList id={buyOffers.data.id} result={buyOffers.data.result} />
                    }
                </AccordionDetails>
            </Accordion>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </div>
    )
}

