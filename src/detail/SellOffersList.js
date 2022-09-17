import QRCode from "react-qr-code";
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';

// Material
import {
    Avatar,
    Backdrop,
    Button,
    ButtonGroup,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    Typography
} from '@mui/material';
// import { deepOrange } from '@mui/material/colors';

// Iconify
import { Icon } from '@iconify/react';

// Utils
import { getUnixTimeEpochFromRippleEpoch } from 'src/utils/parse';
import { acceptSellOffer, cancelOffer, getSellAndBuyOffers } from 'src/utils/tokenActions';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { setNFTs } from 'src/redux/statusSlice';

// Components
import CountdownTimer from './CountDownTimer';

// cannot accept buy offer if you are not the owner of token.
// cannot accept sell offer if seller is not the owner of token.
// cannot accept sell offer if recepient account is not you.
// cannot accept offer if the expiration time and the closing time of the parent ledger has passed.
// cannot accept an offer made by you.

export default function SellOffersList({ _offers, _TokenID, _isOwner }) {
    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;
    // const account = useSelector(state => state.account.account);
    const login = true; // useSelector(state => state.account.login);
    const [offers, setOffers] = useState([..._offers]);
    const [openQR, setOpenQR] = useState(false);
    const [qrCode, setQRCode] = useState('');

    const openQRCode = (index) => {
        setQRCode(index)
        setOpenQR(true)
    }

    const handleCancelOffer = async (index) => {
        if (!account) return;
        setLoading(true)
        try {
            const res = await cancelOffer(account.secret, index, _TokenID)
            setOffers(res.sellOffers)
            console.log('selloffer', res.selloffers)
            enqueueSnackbar('Cancel offer success:' + index.slice(0, 10) + '...', {
                variant: 'success'
            })
        } catch (e) {
            // TODO: snack bar error
            enqueueSnackbar(e.message, {
                variant: 'error'
            })
        }
        setLoading(false)
    }

    const handleAccept = async (index) => {
        setLoading(true)
        try {
            const res = await acceptSellOffer(account.secret, index)           
            dispatch(setNFTs(res ?? []))
            const offers = await getSellAndBuyOffers(_TokenID)
            if(offers){
            setOffers(offers.sellOffers)
            enqueueSnackbar('Accept offer success:' + index.slice(0, 10) + '...', {
                variant: 'success'
            })}
            else {
                enqueueSnackbar('Offer failed. You can’t create a buy offer. The owner address is incorrect. May be the NFT’s owner is changed', {
                    variant: 'error'
                })
               }
        } catch (e) {
            // TODO: snack bar error
            enqueueSnackbar('Offer failed. You can’t create a buy offer. The owner address is incorrect. May be the NFT’s owner is changed', {
                variant: 'error'
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        setOffers([..._offers])
    }, [_offers])
    return (
        <>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <FadeLoader color='lightGreen' size={50} />
                {/* <Typography>loading...</Typography> */}
            </Backdrop>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openQR}
                onClick={() => {
                    setOpenQR(false)
                }}
            >
                <div style={{ background: 'white', padding: '16px' }}>
                    <QRCode
                        // value={'hello, peter'}
                        value={qrCode}
                        size={256}
                    />
                </div>
            </Backdrop>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    offers.length ?
                        offers.map((offer) => (
                            <div key={offer.nft_offer_index}>
                                <ListItem alignItems='center' >
                                    <ListItemAvatar sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant='caption'>
                                            Index
                                        </Typography>
                                        <Avatar sx={{ bgcolor: 'orange', cursor: 'pointer' }}
                                            onClick={() => openQRCode(offer.nft_offer_index)}
                                        >
                                            <Typography variant='string'>
                                                {offer.nft_offer_index.slice(0, 3)}
                                            </Typography>
                                        </Avatar>

                                    </ListItemAvatar>
                                    <Container sx={{ overflowWrap: 'anywhere' }}>
                                        <Grid container columnSpacing={3} alignItems='center'>
                                            <Grid item >
                                                <Typography
                                                    variant='caption'
                                                >
                                                    Price
                                                </Typography>
                                            </Grid>
                                            <Grid item >
                                                <Typography
                                                    variant='string'
                                                >
                                                    {offer.amount / (10 ** 6) + ' XRP'}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container columnSpacing={3} alignItems='center'>
                                            <Grid item >
                                                <Typography
                                                    variant='caption'
                                                >
                                                    Owner:
                                                </Typography>
                                            </Grid>
                                            <Grid item >
                                                <Typography
                                                    variant='string'
                                                >
                                                    {offer.owner}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container columnSpacing={3} alignItems='center'>
                                            {
                                                offer.destination &&
                                                <>
                                                    <Grid item>
                                                        <Typography
                                                            variant='caption'
                                                        >
                                                            Destination:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item >
                                                        <Typography
                                                            variant='string'
                                                        >
                                                            {offer.destination}
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            }
                                        </Grid>
                                        {
                                            offer.expiration ?
                                                <Grid container columnSpacing={3}>
                                                    <Grid item>
                                                        <Typography variant='caption'>Expires by {new Date(getUnixTimeEpochFromRippleEpoch(offer.expiration)).toLocaleString()}</Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <CountdownTimer targetDate={getUnixTimeEpochFromRippleEpoch(offer.expiration)} />
                                                    </Grid>
                                                </Grid>
                                                :
                                                <Grid container>

                                                    <Grid item>
                                                        <Typography variant='string'>No Expiration</Typography>
                                                    </Grid>
                                                </Grid>
                                        }
                                        <Grid container >
                                            <Grid item xs={12} >
                                                <ButtonGroup variant="outlined" >
                                                    <Button aria-label="accept"
                                                        onClick={() => handleAccept(offer.nft_offer_index)}
                                                        sx={{ borderRadius: 10 }}
                                                        color="success"
                                                        disabled={
                                                            // Can't accept
                                                            // when account is owner of offer
                                                            // or account is owner of nft
                                                            // account.key === offer.owner ||
                                                            // owner === account.key
                                                            !login || _isOwner || offer.owner === account.key
                                                        }
                                                        startIcon={<Icon icon='akar-icons:check' />}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button aria-label="cancel"
                                                        onClick={() => handleCancelOffer(offer.nft_offer_index)}
                                                        sx={{ borderRadius: 10 }}
                                                        color="error"
                                                        disabled={
                                                            // Cant cancel offer when
                                                            // account is not owner of offer
                                                            // account.key !== offer.owner
                                                            !login || offer.owner !== account.key
                                                        }
                                                        startIcon={<Icon icon='iconoir:cancel' />}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </ListItem>
                                <Divider component='li' />
                            </div>
                        ))
                        :
                        <Typography>No Offers yet</Typography>
                }
            </List>
        </>
    );
}
