import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box,
    Button,
    ButtonGroup,
    DialogActions,
    DialogContent,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import XSnackbar from 'components/common/Snackbar';
import { useSnackbar } from 'hooks/useSnackbar';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import TokenFlagsForm from 'components/miniting/TokenFlagsForm'
import { tfTransferable, XRPNFT_DOMAIN } from 'utils/constants'
import InfoIcon from '@mui/icons-material/Info';
import { burnToken, mintToken } from 'utils/tokenActions'
import { resetIpfsState } from 'app/slices/ipfSlice'
import { createBuyOffer, createSellOffer, getSellAndBuyOffers, getBuyOffers, getSellOffers } from 'utils/tokenActions'
import { pinJsonToIPFS } from 'utils/pinata'
import { getCurrentRippleEpoch } from 'utils/utils';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { useNavigate } from 'react-router-dom'

export default function BurnNFTDgContent({ close, NFTokenID }) {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const account = useSelector(state => state.account.account)
    const login = useSelector(state => state.account.login)
    const [price, setPrice] = useState(0)
    const handleBurn = async () => {
        if (login) {
            setLoading(true)
            try {
                await burnToken(
                    account.secret,
                    NFTokenID,
                )
                openSnackbar('Offer succeed!', 'success')
                close()
                navigate('/account')
            } catch (e) {
                openSnackbar(e.message, 'error')

            }
            setLoading(false)
        } else {
            openSnackbar('You have to log in first!', 'error')
            // navigate('/login')
        }
    }

    const handleCancel = () => {
        close()
    }

    return (
        <>
            <DialogContent dividers sx={{ backgroundColor: (theme) => (theme.palette.background.paper) }}>
                <Alert severity="warning" sx={{ backgroundColor: (theme) => (theme.palette.background.paper) }}>
                    <AlertTitle>Warning</AlertTitle>
                    You are going to permanently destroy a NFToken. In practice, the NFToken is transferred to an account that is inaccessible, rendering it irretrievable.
                </Alert>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    sx={{ padding: 1 }}
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<Icon icon='ps:feedburner' />}
                    onClick={handleBurn}
                >
                    Burn
                </LoadingButton>
                <Button autoFocus onClick={handleCancel}>Cancel</Button>
            </DialogActions>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    )
}