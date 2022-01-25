import * as React from 'react';
//import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
// icons
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
// material
import {
  Button,
  IconButton,
  Stack,
  List,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  DialogActions,
  Avatar,
  Dialog,
  DialogTitle,
  Container,
  Typography,
  Card,
  Divider,
  Paper,
 } from '@mui/material';

// components
import Page from '../components/Page';
import TesterControls from '../components/tester/TesterControls';

const accounts = [
	{id:1, key:'rp6yyGhjFR4Va6Eor8aPDAjj57R9cawqWn', secret:'sh1yErMN7rkZegwuTg1ZNMvRAGiQM'},
	{id:2, key:'rBtxuG1TDYk85igMGZEx2PVixXasbJWPS7', secret:'spojbN1oj6EAvAQQP8X5nTtVeLXsc'},
	{id:3, key:'rUVey2NFANvF61HCCjcCmRqRBBeDCVSGQg', secret:'snjUkkMByL57HjavjdjoX2Hi5Mpqf'},
	{id:4, key:'roCuCcXVFMXrcHKoE4zPLjDzBY35JDjgN', secret:'shEPrFrmm7RfXpebvo2goQVV5ErXE'},
	{id:5, key:'rG2xxwM6xUTc5QvZrde4QtGk6fAqtsxy7m', secret:'spvQYKEvbqBmeHL56ATSrMzAkg2dF'},
	{id:6, key:'r9f3fG8Y1QjZ9gdYMb3by2T5vkfLE2qYxb', secret:'shcBBdHbtYGMWvR54d3tJaPwpFLDn'},
	{id:7, key:'rLsxBDBg2E129qoMWxk9PKpjmvsU59dWoB', secret:'ssqxhYpqpbpNL5NzjfDLYBRJq9w21'},
	{id:8, key:'rPrzGpuLxnE2XWzNYJ2P1tR6mCQU2FcckS', secret:'snDiyu26npfn6FBFXZJbKNNyZtwSH'},
	{id:9, key:'rPku8R9rWfZu73U8SxAuy7Leac5NaqfNfh', secret:'sn3ivz8y8UvHwoFA8jKSX8rGRyyyf'},
	{id:10, key:'rwjXkasNG3RGfddbo2o9Rd7tEZetnPHH4f', secret:'shsaEo9V1iqtebYZkUaFfndrSr4JB'},
];


// https://xrpl.org/xrp-testnet-faucet.html

    // <Button
    //     variant="contained"
    //     component={RouterLink}
    //     to="#"
    //     startIcon={<PersonAddAltOutlinedIcon/>}
    //     >
    // </Button>

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
              <Divider />
              <Paper style={{maxHeight: 400, overflow: 'auto'}}>
                  <List component="nav" sx={{ pt: 0 }}>
                  {accounts.map((account) => (
                      <ListItemButton
                          selected={selectedIndex === account.id}
                          onClick={(event) => handleListItemClick(event, account.id)}
                          key={account.id}>
                          <ListItemAvatar>
                          <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                              <PersonIcon />
                          </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={`Account ${account.id}`} secondary={account.key} />
                      </ListItemButton>
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
      
      ChooseAccountDialog.propTypes = {
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired,
        selectedValue: PropTypes.object.isRequired,
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
