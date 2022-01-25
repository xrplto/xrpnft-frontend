import * as React from 'react';
//import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
// icons
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
// material
import {
  Button,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  Avatar,
  Dialog,
  DialogTitle,
  Container,
  Typography,
  Card,
//  Table,
//  TableBody,
//  TableRow,
//  TableCell,
//  TableContainer
 } from '@mui/material';

// components
import Page from '../components/Page';
import TesterControls from '../components/tester/TesterControls';

import { blue } from '@mui/material/colors';


// https://xrpl.org/xrp-testnet-faucet.html

    // <Button
    //     variant="contained"
    //     component={RouterLink}
    //     to="#"
    //     startIcon={<PersonAddAltOutlinedIcon/>}
    //     >
    // </Button>

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
    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef(null);
  
    React.useEffect(() => {
      if (!open) {
        setValue(valueProp);
      }
    }, [valueProp, open]);
  
    const handleEntering = () => {
      if (radioGroupRef.current != null) {
        radioGroupRef.current.focus();
      }
    };
  
    const handleCancel = () => {
      onClose();
    };
  
    const handleOk = () => {
      onClose(value);
    };
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        TransitionProps={{ onEntering: handleEntering }}
        open={open}
        {...other}
      >
        <DialogTitle>Choose an account</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            ref={radioGroupRef}
            aria-label="account"
            name="account"
            value={value}
            onChange={handleChange}
          >
            {accounts.map((account) => (
              <FormControlLabel
                value={account}
                key={account}
                control={<Radio />}
                label={account}
              />
            ))}
          </RadioGroup>
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
    value: PropTypes.string.isRequired,
};

export default function TokenTester() {
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
    <Page title="NFToken Tester">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} mb={1}>
          <Typography variant="h4" gutterBottom>
            NFToken Tester
          </Typography>
          <IconButton aria-label="manage account" onClick={handleClickOpen}>
            <ManageAccountsOutlinedIcon />
          </IconButton>
          <ChooseAccountDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
        </Stack>
        
        <Card sx={{ pl: 3, pb: 2 }}>
          <TesterControls/>
        </Card>
        
      </Container>
    </Page>
  );
}
