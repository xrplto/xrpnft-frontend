import * as React from 'react';
import PropTypes from 'prop-types';
import { Button,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    DialogTitle,
    Dialog,
    Typography,
    useMediaQuery,
    DialogActions,
    DialogContent,
    ListItemButton,
    ListItemIcon,
    Divider
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import DialogContentText from '@mui/material/DialogContentText';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

const accounts = [
	'rp6yyGhjFR4Va6Eor8aPDAjj57R9cawqWn', // 1
	'rBtxuG1TDYk85igMGZEx2PVixXasbJWPS7', // 2
	'rUVey2NFANvF61HCCjcCmRqRBBeDCVSGQg', // 3
	'roCuCcXVFMXrcHKoE4zPLjDzBY35JDjgN',  // 4
	'rG2xxwM6xUTc5QvZrde4QtGk6fAqtsxy7m', // 5
	'r9f3fG8Y1QjZ9gdYMb3by2T5vkfLE2qYxb', // 6
	'rLsxBDBg2E129qoMWxk9PKpjmvsU59dWoB', // 7
	'rPrzGpuLxnE2XWzNYJ2P1tR6mCQU2FcckS', // 8
	'rPku8R9rWfZu73U8SxAuy7Leac5NaqfNfh', // 9
	'rwjXkasNG3RGfddbo2o9Rd7tEZetnPHH4f', // 10
];
const secrets = [
	'sh1yErMN7rkZegwuTg1ZNMvRAGiQM', // 1
	'spojbN1oj6EAvAQQP8X5nTtVeLXsc', // 2
	'snjUkkMByL57HjavjdjoX2Hi5Mpqf', // 3
	'shEPrFrmm7RfXpebvo2goQVV5ErXE', // 4
	'spvQYKEvbqBmeHL56ATSrMzAkg2dF', // 5
	'shcBBdHbtYGMWvR54d3tJaPwpFLDn', // 6
	'ssqxhYpqpbpNL5NzjfDLYBRJq9w21', // 7
	'snDiyu26npfn6FBFXZJbKNNyZtwSH', // 8
	'sn3ivz8y8UvHwoFA8jKSX8rGRyyyf', // 9
	'shsaEo9V1iqtebYZkUaFfndrSr4JB', // 10
];

function ChooseAccountDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    //onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Choose an Account</DialogTitle>
        <DialogContent dividers>
                <List component="nav" aria-label="main mailbox folders">
                <ListItemButton
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}
                >
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
                </ListItemButton>
                <ListItemButton
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}
                >
                <ListItemIcon>
                    <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
                </ListItemButton>
            </List>
            <Divider />
            <List sx={{ pt: 0 }}>
            {accounts.map((account) => (
            <ListItem
                selected={selectedIndex === 1}
                button onClick={() => handleListItemClick(account)} key={account}>
                <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <PersonIcon />
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={account} />
            </ListItem>
            ))}
            </List>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
    </Dialog>
  );
}

ChooseAccountDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function ChooseAccountDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(accounts[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <ChooseAccountDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
