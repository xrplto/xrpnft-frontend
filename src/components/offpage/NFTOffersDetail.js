import * as React from 'react'
import Divider from '@mui/material/Divider'
import { Typography, Stack, ButtonGroup, Link, Skeleton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import TimePeriods from 'components/offpage/TimePeriodsDropdown'
import { styled } from '@mui/material/styles'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import TimelineIcon from '@mui/icons-material/Timeline'
import { CountdownTimer } from './CountDownTimer'
import { NFTokenProps } from 'types/types'
import ListIcon from '@mui/icons-material/List'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createBuyOffer, createSellOffer, getSellAndBuyOffers } from 'utils/tokenActions'
import XSnackbar from 'components/common/Snackbar'
import { useSnackbar } from 'hooks/useSnackbar'
import SellOffersList from './SellOffersList'
import OfferList from './OfferList'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BuyOffersList from './BuyOffersList'
import { getIssuer } from 'utils/utils'

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    borderRadius: 5,
    marginTop: theme.spacing(2),
    '&:before': {
        display: 'none',
    },
}))

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        //   expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}))


NFTOffersDetail.propTypes = NFTokenProps

export default function NFTOffersDetail({ tokenID, URI }) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const [pageLoading, setPageLoading] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [sellOffers, setSellOffers] = React.useState({})
    const [offers, setOffers] = React.useState({})
    const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000
    const NOW_IN_MS = new Date().getTime()
    const login = useSelector(state => state.account.login)
    const account = useSelector(state => state.account.account)
    const navigate = useNavigate()
    const [owner, setOwner] = React.useState(null)
    const [price, setPrice] = React.useState(0)
    const [expanded, setExpanded] = React.useState('panel1')
    const [expandedPrice, setExpandedPrice] = React.useState(true)
    const [expandedListing, setExpandedListing] = React.useState(true)
    const [expandedOffers, setExpandedOffers] = React.useState(true)

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false)
    }

    const handleSellOffer = async () => {
        if (login) {
            setLoading(true)
            console.log('Making offer...')
            try {
                const res = await createSellOffer(account.secret, tokenID, '20000', 1)
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

    const handleBuyOfferBtnClick = async () => {
        if (login) {
            setLoading(true)
            console.log('Making offer...')
            try {
                const res = await createBuyOffer(account.secret, tokenID, '1000', 0, owner)
                setOffers(res.buyOffers.result)
                openSnackbar('Offer succeed!', 'success')
            } catch (e) {
                openSnackbar(e.message, 'error')
            }
            setLoading(false)
        } else {
            navigate('/login')
        }
    }

    const fetchListingAndOffers = async (mounted) => {
        setPageLoading(true)
        try {
            const res = await getSellAndBuyOffers(tokenID)
            if (mounted) {
                console.log(res.sellOffers.result.offers)
                if (res.sellOffers.result.offers.length > 0) {
                    setOwner(res.sellOffers.result.offers[0].owner)
                    setPrice(+res.sellOffers.result.offers[0].amount / 10 ** 6)
                    setSellOffers(res.sellOffers.result)
                    setOffers(res.buyOffers.result)
                }
                else setOwner(getIssuer(tokenID))
            }
        } catch (e) {
            // console.log(e)
            openSnackbar(e.message, 'error')
        }
        setPageLoading(false)
    }

    React.useEffect(() => {
        let mounted = true
        fetchListingAndOffers(mounted)
        return () => {
            mounted = false
        }
    }, [])
    return (
        <div>
            <Stack spacing={2} marginTop={1}>
                <Link underline='none'>
                    NFTKings
                </Link>
                <Typography variant='subtitle' gutterBottom fontSize={30} overflow='hidden' fontWeight={600}>
                    Peaceful Ape
                </Typography>
                <Stack spacing={1}>
                    <Typography variant='subtitle1' >
                        Owned by
                    </Typography>
                    {
                        !pageLoading ?
                            <Link href='#' underline='none'>
                                {owner}
                            </Link> :
                            <Skeleton animation='wave' height={40} width='100%' />
                    }
                </Stack>
            </Stack>
            <Accordion expanded={true} >
                <AccordionSummary
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                    expandIcon={<ExpandMoreIcon />}
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
                            disabled={account.key !== owner || owner === null}
                        >
                            Sell Offer
                        </LoadingButton>
                        <LoadingButton
                            sx={{ borderRadius: 10 }}
                            loading={loading}
                            loadingPosition='start'
                            variant='outlined'
                            onClick={handleBuyOfferBtnClick}
                            disabled={account.key === owner || owner === null}
                            startIcon={<AccountBalanceWalletIcon />}>
                            Buy Offer
                        </LoadingButton>
                    </ButtonGroup>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedPrice} onChange={() => setExpandedPrice(!expandedPrice)} >
                <AccordionSummary
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
            <Accordion expanded={expandedListing} onChange={() => setExpandedListing(!expandedListing)}>
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
                            <SellOffersList listings={sellOffers} tokenID={tokenID} owner={owner} />
                            :
                            <Skeleton animation='wave' height={100} width='100%' />
                    }
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expandedOffers} onChange={() => setExpandedOffers(!expandedOffers)}>
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
                        !pageLoading ?
                            offers &&
                            <BuyOffersList listings={offers} tokenID={tokenID} owner={owner} />
                            :
                            <Skeleton animation='wave' height={100} width='100%' />
                    }
                </AccordionDetails>
            </Accordion>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </div>
    )
}

