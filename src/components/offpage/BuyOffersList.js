import { useState, useEffect } from 'react';
import { List, Container, Grid, ButtonGroup, Backdrop, Button } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Icon } from '@iconify/react';
import { acceptBuyOffer, cancelOffer } from 'utils/tokenActions';
import { ListingsListProps } from 'utils/types';
import XSnackbar from 'components/common/Snackbar'
import { useSnackbar } from 'hooks/useSnackbar'
import { useSelector } from 'react-redux'
import { FadeLoader } from 'react-spinners';


BuyOffersList.propTypes = ListingsListProps

export default function BuyOffersList({ tokenID, listings, owner }) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)
    const account = useSelector(state => state.account.account)
    const login = useSelector(state => state.account.login)
    const [offers, setOffers] = useState([])
    const handleCancelOffer = async (index) => {
        setLoading(true)
        try {
            const res = await cancelOffer(account.secret, index, tokenID)
            if(res.buyOffers)
            setOffers(res.result.offers)
            else setOffers([])
            openSnackbar('Cancel offer success:' + index.slice(0, 10) + '...', 'success')
        } catch (e) {
            // TODO: snack bar error
            openSnackbar(e.message, 'error')
        }
        setLoading(false)
    }

    const handleAccept = async (index) => {
        setLoading(true)
        try {
            const res = await acceptBuyOffer(account.secret, index)
            console.log('buyOffers:', res)
            openSnackbar('Success, Offer index:' + index.slice(0, 10) + '...', 'success')
        } catch (e) {
            // TODO: snack bar error
            openSnackbar(e.message, 'error')
        }
        setLoading(false)
    }

    useEffect(() => {
        setOffers(listings.offers)
    }, [listings])

    return (
        <>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <FadeLoader color='lightGreen' size={50} />
            </Backdrop>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    offers ?
                        offers.map((offer) => (
                            <div key={offer.index}>
                                <ListItem alignItems='center' >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'lightseagreen' }}>
                                            <Typography>
                                                {offer.index.slice(0, 2)}
                                            </Typography>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <Container sx={{ overflowWrap: 'anywhere' }}>
                                        <Grid container>
                                            <Grid item xs={2}>
                                                <Typography
                                                    variant='subtitle1'
                                                >
                                                    Price
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography
                                                    variant='string'
                                                >
                                                    {offer.amount / (10 ** 6) + ' XRP'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography
                                                    variant='subtitle1'
                                                >
                                                    Owner:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={10}>
                                                <Typography
                                                    variant='string'
                                                >
                                                    {offer.owner}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} >
                                                <ButtonGroup variant="outlined">
                                                    <Button aria-label="accept"
                                                        onClick={() => handleAccept(offer.index)}
                                                        color="success"
                                                        disabled={
                                                            !login
                                                            // Can't accept Buy offer when
                                                            // account is not owner of nft
                                                            // or account is owner of offer
                                                            // account.key === offer.owner
                                                            // ||
                                                            // owner === offer.owner
                                                        }
                                                        sx={{ borderRadius: 10 }}
                                                        startIcon={<Icon icon='akar-icons:check' />}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button aria-label="cancel"
                                                        onClick={() => handleCancelOffer(offer.index)}
                                                        color="error"
                                                        disabled={
                                                            // Can't cancel buy offer
                                                            // when the account is not
                                                            // owner of offer
                                                            // account.key !== offer.owner
                                                            !login
                                                        }
                                                        sx={{ borderRadius: 10 }}
                                                        startIcon={<Icon icon='iconoir:cancel' />}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </ListItem>
                                <Divider variant='inset' component='li' />
                            </div>
                        ))
                        :
                        <Typography>No Offers yet</Typography>
                }
            </List>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    );
}
