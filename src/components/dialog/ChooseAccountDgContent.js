import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { alpha, useTheme, styled } from '@mui/material/styles';
import roundAccountCircle from '@iconify/icons-ic/round-account-circle';
import { useDispatch } from 'react-redux'
import { select } from 'app/slices/accountSlice';
import { NavLink } from 'react-router-dom';
import {
    Button,
    Paper,
    DialogActions,
    Divider,
    List,
    ListItemText,
    ListItemIcon,
    ListItemButton,
} from '@mui/material';
import { ACCOUNTS } from 'utils/constants';


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
);

const ListItemIconStyle = styled(ListItemIcon)({
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

ChooseAccountDgContent.propTypes = {
    close: PropTypes.func.isRequired,
};

// export default function ChooseAccountDgContent({ onClose, accounts, selectedIdx, render }) {
export default function ChooseAccountDgContent({ close }) {
    const dispatch = useDispatch()
    const [account, setAccount] = useState({key: null, secret: null});

    const theme = useTheme();
    const icon = <Icon icon={roundAccountCircle} width={48} height={48} />;

    const selectedStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:before': { display: 'block' }
    };

    const handleListItemClick = (event, account) => {
        event.preventDefault()
        setAccount({...account});
    };

    const handleOk = () => {
        close();
        // TODO: Open a new page with selected account
        dispatch(select(account))
    };

    return (
        <>
            <Paper style={{ borderRadius: 0 }}>
                <List disablePadding>
                    {ACCOUNTS.map((item) => (
                        <ListItemStyle
                            onClick={(event) => handleListItemClick(event, item)}
                            key={item.key}
                            sx={{
                                ...((account.key === item.key) && selectedStyle)
                            }}
                        >
                            <ListItemIconStyle>{icon}</ListItemIconStyle>
                            <ListItemText primary={`Account ${item.id}`} secondary={item.key} />
                        </ListItemStyle>
                    ))}
                </List>
            </Paper>
            <Divider />
            <DialogActions>
                <Button autoFocus onClick={close}>Cancel</Button>
                <NavLink to='/account'>
                    {/* <Button startIcon={<AccountBalanceWalletIcon />}>Account</Button> */}
                    <Button onClick={handleOk}>Ok</Button>
                </NavLink>
            </DialogActions>
        </>
    );
}