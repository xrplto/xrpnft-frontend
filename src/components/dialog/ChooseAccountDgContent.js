import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Material
import {
    alpha, useTheme, styled,
    Button,
    Paper,
    DialogActions,
    Divider,
    List,
    ListItemText,
    ListItemIcon,
    ListItemButton,
} from '@mui/material';

// Iconify
import { Icon } from '@iconify/react';
import roundAccountCircle from '@iconify/icons-ic/round-account-circle';

// Redux
import { useDispatch } from 'react-redux';
import { doSetAccount, login, setNFTs } from 'src/redux/statusSlice';

// Utils
import { ACCOUNTS } from 'src/utils/constants';
import { getTokens } from 'src/utils/tokenActions';

// Components

const ListItemStyle = styled((props) => <ListItemButton disableGutters {...props} />)(
    ({ theme }) => ({
        ...theme.typography.body2,
        height: 56,
        position: 'relative',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2.5),
        color: theme.palette.text.secondary,
        '&:before': {
            top: 0, right: 0, width: 3, bottom: 0,
            content: "''",
            display: 'none',
            position: 'absolute',
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            backgroundColor: theme.palette.primary.main
        }
    })
)

const ListItemIconStyle = styled(ListItemIcon)({
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
})

export default function ChooseAccountDgContent() {
    const { isOpen, msg, variant, openSnackbar, closeSnackbar } = useSnackbar()
    const theme = useTheme()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [account, setAccount] = useState({ key: null, secret: null })

    const icon = <Icon icon={roundAccountCircle} width={48} height={48} />

    const selectedStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:before': { display: 'block' }
    }

    const handleListItemClick = (event, account) => {
        event.preventDefault()
        setAccount({ ...account })
    }

    const handleOk = async () => {
        // TODO: Open a new page with selected account
        // console.log('sendgindsdfsdf')
        // console.log('account', account.account)
        // navigate(`/account/${nftoken.TokenID}?tokenURI=${nftoken.URI}`)
        if (account.account) {
            dispatch(doSetAccount(account))
            const res = await getTokens(account.account)
            try {
                
                console.log("gettoken",res)
                dispatch(setNFTs(res.account_nfts))
            } catch (e) {
                openSnackbar(e.message, 'error')
            }
            // if(res){
            dispatch(login())
            navigate(`/explore/${account.account}`)
            // }
            // else{
            //     openSnackbar('Network is unstable','error')
            // }
        } else {
            openSnackbar('Select an account!', 'error')
        }
    }

    const handleCancel = () => {
        // TODO: Open a new page with selected account
        // navigate(`/account/${nftoken.TokenID}?tokenURI=${nftoken.URI}`)
        navigate(`/`)
    }

    return (
        <>
            <Paper style={{ borderRadius: 0 }}>
                <List disablePadding>
                    {ACCOUNTS.map((item) => (
                        <ListItemStyle
                            onClick={(event) => handleListItemClick(event, item)}
                            key={item.account}
                            sx={{
                                ...((account.account === item.account) && selectedStyle)
                            }}
                        >
                            <ListItemIconStyle>{icon}</ListItemIconStyle>
                            <ListItemText primary={`Account ${item.id}`} secondary={item.account} />
                        </ListItemStyle>
                    ))}
                </List>
            </Paper>
            <Divider />
            <DialogActions>
                <Button onClick={handleOk}>Login</Button>
                <Button autoFocus onClick={handleCancel}>Cancel</Button>
            </DialogActions>
        </>
    )
}