import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { FadeLoader } from 'react-spinners';
import { normalizeAmount } from 'src/utils/normalizers';

// Material
import {
    Avatar,
    Backdrop,
    Button,
    ButtonGroup,
    Container,
    Divider,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
// import { deepOrange } from '@mui/material/colors';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

// Iconify
import { Icon } from '@iconify/react';

// Utils
import { getUnixTimeEpochFromRippleEpoch } from 'src/utils/parse';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
import CountdownTimer from './CountDownTimer';

// cannot accept buy offer if you are not the owner of token.
// cannot accept sell offer if seller is not the owner of token.
// cannot accept sell offer if recepient account is not you.
// cannot accept offer if the expiration time and the closing time of the parent ledger has passed.
// cannot accept an offer made by you.

export default function SellOffersList({ NFTokenID, offers, isOwner }) {
    const [loading, setLoading] = useState(false);
    const { accountProfile } = useContext(AppContext);
    const account = accountProfile?.account;

    const handleCancelOffer = async (index) => {
    }

    const handleAcceptOffer = async (index) => {
    }

    return (
        <>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <FadeLoader color='lightGreen' size={50} />
                {/* <Typography>loading...</Typography> */}
            </Backdrop>

            <Stack>
                {
                    offers.map((offer, idx) => {
                        const price = normalizeAmount(offer.amount);
                        return (
                            <Stack key={offer.nft_offer_index} sx={{mt: 2}}>
                                <Stack direction="row" spacing={1} alignItems="center">

                                    <Stack>
                                        {account && !isOwner &&
                                            <Tooltip title="Accept Offer">
                                                <IconButton
                                                    aria-label='close'
                                                    onClick={() => handleAcceptOffer(offer.nft_offer_index)}
                                                    
                                                >
                                                    <CheckCircleOutlineIcon fontSize='large' color='success' />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                        {account && isOwner &&
                                            <Tooltip title="Cancel Offer">
                                                <IconButton
                                                    aria-label='close'
                                                    onClick={() => handleCancelOffer(offer.nft_offer_index)}
                                                    
                                                >
                                                    <HighlightOffIcon fontSize='large' color='error' />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant='s6' color='#33C2FF'>{price.amount} {price.name}</Typography>
                                            <Link
                                                color="inherit"
                                                target="_blank"
                                                href={`https://xls20.bithomp.com/explorer/${offer.owner}`}
                                                rel="noreferrer noopener nofollow"
                                            >
                                                <Typography variant='s6'>{offer.owner}</Typography>
                                            </Link>
                                        </Stack>

                                        {offer.destination &&
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {/* <Typography variant='s4'>Destination</Typography> */}
                                                <TransferWithinAStationIcon />
                                                <Typography variant='s6'>{offer.destination}</Typography>
                                            </Stack>
                                        }

                                        {/* {offer.expiration ?
                                            <Stack direction="row" alignItems="center">
                                                <Typography variant='s4'>Expires by {new Date(getUnixTimeEpochFromRippleEpoch(offer.expiration)).toLocaleString()}</Typography>
                                                <CountdownTimer targetDate={getUnixTimeEpochFromRippleEpoch(offer.expiration)} />
                                            </Stack>
                                            :
                                            <Stack direction="row" alignItems="center">
                                                <Typography variant='string'>No Expiration</Typography>
                                            </Stack>
                                        } */}
                                    </Stack>
                                </Stack>
                                <Divider sx={{mt:2}} />
                            </Stack>
                        )
                    })
                }
            </Stack>
        </>
    );
}
