import * as React from 'react';
//import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
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
    ListItemButton 
} from '@mui/material';

import roundAccountCircle from '@iconify/icons-ic/round-account-circle';
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

ChooseAccountDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    accounts: PropTypes.array.isRequired,
    selectedValue: PropTypes.number.isRequired,
};


export default function ChooseAccountDialog(props) {
    const { onClose, accounts, selectedValue, open } = props;
    const [selectedIndex, setSelectedIndex] = React.useState(selectedValue);

	const theme = useTheme();
	const icon = <Icon icon={roundAccountCircle} width={48} height={48} />;
	console.log(selectedIndex);
	const selectedStyle = {
	color: 'primary.main',
	fontWeight: 'fontWeightMedium',
	bgcolor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
	'&:before': { display: 'block' }
	};
   
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    const handleCancel = () => {
        onClose(0);
    };
    
    const handleOk = () => {
        onClose(selectedIndex);
        alert("handleOk");
    };

    const handleClose = () => {
    };
    
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Choose an Account</DialogTitle>
            <Divider />
            <Paper style={{maxHeight: 320, overflow: 'auto', borderRadius:0}}>
                <List disablePadding>
                    {accounts.map((item) => (
                    <ListItemStyle
                        onClick={(event) => handleListItemClick(event, item.id)}
                        key={item.id}
                        sx={{
                            ...((selectedIndex === item.id) && selectedStyle)
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
                <Button autoFocus onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}