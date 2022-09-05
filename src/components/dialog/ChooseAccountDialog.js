import { useState } from 'react';

// Material
import { alpha, useTheme, styled } from '@mui/material/styles';
import {
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogActions,
    Divider,
    List,
    ListItemText,
    ListItemIcon,
    ListItemButton,
} from '@mui/material';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Iconify
import { Icon } from '@iconify/react';
import roundAccountCircle from '@iconify/icons-ic/round-account-circle';
import userLock from '@iconify/icons-fa-solid/user-lock';

// Utils
import { ACCOUNTS } from 'src/utils/constants';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function ChooseAccountDialog({}) {
    const [open, setOpen] = useState(false);
    const { accountProfile, setAccountProfile, setLoading } = useContext(AppContext);
    const [selectedIndex, setSelectedIndex] = useState(accountProfile.id);

	const theme = useTheme();
	const icon = <Icon icon={roundAccountCircle} width={48} height={48} />;

	const selectedStyle = {
        color: 'primary.main',
        fontWeight: 'fontWeightMedium',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
        '&:before': { display: 'block' }
	};

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleOk = () => {
        const id = selectedIndex;
        const account = ACCOUNTS[id - 1].account;
        setAccountProfile({account, id});

        setOpen(false);
    };

    return (
        <>
        <Button
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<Icon icon={userLock}/>}
        >
            Account {ACCOUNTS[selectedIndex - 1].id}
        </Button>
        <Dialog onClose={handleClose} open={open} disableScrollLock>
            <DialogTitle>Choose an Account</DialogTitle>
            <Divider />
            <Paper style={{maxHeight: 320, overflow: 'auto', borderRadius:0}}>
                <List disablePadding>
                    {ACCOUNTS.map((item) => (
                    <ListItemStyle
                        onClick={(event) => handleListItemClick(event, item.id)}
                        key={item.id}
                        sx={{
                            ...((selectedIndex === item.id) && selectedStyle)
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
                <Button autoFocus onClick={handleClose}>Cancel</Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}