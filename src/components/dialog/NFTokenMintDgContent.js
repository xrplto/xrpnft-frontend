import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Button,
    Container,
    DialogActions,
    Grid,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import XSnackbar from 'components/common/Snackbar';
import { useSnackbar } from 'hooks/useSnackbar';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import TokenFlagsForm from 'components/miniting/TokenFlagsForm'
import { tfTransferable, XRPNFT_DOMAIN } from 'utils/constants'
import InfoIcon from '@mui/icons-material/Info';
import { mintToken } from 'utils/tokenActions'
import { resetIpfsState } from 'app/slices/ipfSlice'
import { pinJsonToIPFS } from 'utils/pinata'

export default function NFTokenMintDgContent({ close, metadata }) {
    const dispatch = useDispatch()
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const flags = useSelector(state => state.ipfs.flags)
    const [loading, setLoading] = useState(false)
    const [issuer, setIssuer] = useState('')
    const [tFee, setFee] = useState(300) //transfer fee
    const [NFTokenTaxon, setNFTokenTaxon] = useState(0) //NFTokenTaxon
    const account = useSelector(state => state.account.account)

    const handleCreate = async () => {
        setLoading(true)
        try {
            const res = await pinJsonToIPFS(metadata)
            if (res.success) {
                const nftMetadataUrl = XRPNFT_DOMAIN + res.response.IpfsHash
                try {
                    const nfts = await mintToken(account.secret, nftMetadataUrl, flags, issuer, tFee)
                    openSnackbar(nfts.result.account, 'success')
                    // TODO: reset ipfs slice when minting succeed
                    dispatch(resetIpfsState())
                } catch (e) {
                    openSnackbar(e.message, 'error')
                    console.log({ e })
                }
            } else {
                openSnackbar('Json Not pinned to Pinata.', 'error')
            }
        } catch (e) {
            openSnackbar(e.message, 'error')
            console.log('error:', { e })
        }
        setLoading(false)
    }

    const handleCancel = () => {
        // TODO: Open a new page with selected account
        // navigate(`/account/${nftoken.tokenID}?tokenURI=${nftoken.URI}`)
        close()
    }

    return (
        <>
            <Paper>
                <Container sx={{ paddingBottom: 2 }}>
                    <Grid container alignItems={'center'} spacing={3}>
                        <Grid item md={3}>
                            <Typography variant='caption' >
                                Set Flags
                            </Typography>
                        </Grid>
                        <Grid item md={9}>
                            <TokenFlagsForm />
                        </Grid>
                        <Grid item md={3}>
                            <Typography variant='caption' >
                                Issuer
                            </Typography>
                            <Tooltip title='(Optional) The issuer of the token, if the sender of the account is issuing it on behalf of another account. This field must be omitted if your account is the issuer of the NFToken.'>
                                <InfoIcon fontSize='small' />
                            </Tooltip>
                        </Grid>
                        <Grid item md={9}>
                            <TextField
                                variant='standard'
                                fullWidth
                                value={issuer}
                                onChange={(e) => {
                                    setIssuer(e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <Typography variant='caption' >
                                Transfer Fee
                            </Typography>
                            <Tooltip title='(Optional) The value specifies the tFee charged by the issuer for secondary sales of the NFToken, if such sales are allowed. Valid values for this field are between 0 and 9999 inclusive, allowing transfer rates of between 0.00% and 99.99% in increments of 0.01. If this field is provided, the transaction MUST have the tfTransferable flag enabled.'>
                                <InfoIcon fontSize='small' />
                            </Tooltip>
                        </Grid>
                        <Grid item md={9}>
                            <TextField
                                variant='standard'
                                fullWidth
                                value={tFee}
                                disabled={ // possible only tfTransferable is set
                                    (flags & tfTransferable) === 0
                                }
                                onChange={(e) => {
                                    if (!isNaN(+e.target.value) && +e.target.value < 10000)
                                        setFee(+e.target.value)
                                }}
                            />
                        </Grid>
                        <Grid item md={3}>
                            <Typography variant='caption' >
                                NFToken Taxon
                            </Typography>
                            <Tooltip title='The taxon associated with the token. The taxon is generally a value chosen by the minter of the token. A given taxon can be used for multiple tokens. Taxon identifiers greater than 0xFFFFFFFF are disallowed.'>
                                <InfoIcon fontSize='small' />
                            </Tooltip>
                        </Grid>
                        <Grid item md={9}>
                            <TextField
                                variant='standard'
                                fullWidth
                                value={NFTokenTaxon}
                                onChange={(e) => {
                                    if (!isNaN(+e.target.value) && +e.target.value < 0xFFFFFFFF)
                                        setNFTokenTaxon(+e.target.value)
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
            <DialogActions>
                <LoadingButton
                    sx={{ padding: 1 }}
                    loading={loading}
                    loadingPosition='start'
                    startIcon={<Icon icon='logos:linux-mint' />}
                    onClick={handleCreate}
                >
                    Create
                </LoadingButton>
                <Button autoFocus onClick={handleCancel}>Cancel</Button>
            </DialogActions>
            <XSnackbar isOpen={isOpen} message={msg} variant={variant} close={closeSnackbar} />
        </>
    )
}