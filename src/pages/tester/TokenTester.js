import { useState } from 'react';
//import { useState, useEffect } from 'react';
//import { Icon } from '@iconify/react';
//import PropTypes from 'prop-types';
// icons
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
// material
import {
    Button,
    Stack,
    Container,
    Typography,
    Card,
 } from '@mui/material';

// components
import Page from '../../components/Page';
import TesterControls from './TesterControls';
import ChooseAccountDialog from './ChooseAccountDialog';

const accounts = [
	{id:1, key:'rht9PFsHK2rds9dp5Nt9op4VWAceR63vWH', secret:'snkPFbLVfK123mxH3SLGchmAAzd37'},
	{id:2, key:'rBtxuG1TDYk85igMGZEx2PVixXasbJWPS7', secret:'spojbN1oj6EAvAQQP8X5nTtVeLXsc'},
	{id:3, key:'rUVey2NFANvF61HCCjcCmRqRBBeDCVSGQg', secret:'snjUkkMByL57HjavjdjoX2Hi5Mpqf'},
	{id:4, key:'roCuCcXVFMXrcHKoE4zPLjDzBY35JDjgN', secret:'shEPrFrmm7RfXpebvo2goQVV5ErXE'},
	{id:5, key:'rG2xxwM6xUTc5QvZrde4QtGk6fAqtsxy7m', secret:'spvQYKEvbqBmeHL56ATSrMzAkg2dF'},
	/*{id:6, key:'r9f3fG8Y1QjZ9gdYMb3by2T5vkfLE2qYxb', secret:'shcBBdHbtYGMWvR54d3tJaPwpFLDn'},
	{id:7, key:'rLsxBDBg2E129qoMWxk9PKpjmvsU59dWoB', secret:'ssqxhYpqpbpNL5NzjfDLYBRJq9w21'},
	{id:8, key:'rPrzGpuLxnE2XWzNYJ2P1tR6mCQU2FcckS', secret:'snDiyu26npfn6FBFXZJbKNNyZtwSH'},
	{id:9, key:'rPku8R9rWfZu73U8SxAuy7Leac5NaqfNfh', secret:'sn3ivz8y8UvHwoFA8jKSX8rGRyyyf'},
	{id:10, key:'rwjXkasNG3RGfddbo2o9Rd7tEZetnPHH4f', secret:'shsaEo9V1iqtebYZkUaFfndrSr4JB'},
    {id:11, key:'rp6yyGhjFR4Va6Eor8aPDAjj57R9cawqWn', secret:'sh1yErMN7rkZegwuTg1ZNMvRAGiQM'},*/
];

// https://xrpl.org/xrp-testnet-faucet.html

// ====================================
// Testnet Servers
// WebSocket
// wss://s.altnet.rippletest.net:51233
// JSON-RPC
// https://s.altnet.rippletest.net:51234
// ====================================
// Devnet Servers
// WebSocket
// wss://s.devnet.rippletest.net:51233
// JSON-RPC
// https://s.devnet.rippletest.net:51234
// ====================================
// NFT-Devnet Servers
// WebSocket
// wss://xls20-sandbox.rippletest.net:51233
// JSON-RPC
// http://xls20-sandbox.rippletest.net:51234
// ====================================
const xrpl = require("xrpl");
async function getAccountInfo() {
    try {
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
        await client.connect();

        const response = await client.request({
            "command": "account_info",
            "account": "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
            "ledger_index": "validated"
        });
        console.log(response);
        client.disconnect();
    } catch (error) {
        console.log(error);
    }
}

export default function TokenTester() {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [values, setValues] = useState({
        account: accounts[0].key,
        secret: accounts[0].secret,
        showSecret: false,
        tokenUrl: 'ipfs://QmXSSpHaG9DH5U7zQNkL4BZrBZioGG3xmG54mqPqTCpddQ',
        flags: '1',
        tokenId: '',
        amount: '1000000'
    });
    //useEffect(() => {
    //});

    const onAccountInfo = () => {
        getAccountInfo();
    };

    const handleChooseAccount = (value) => {
        setSelectedIndex(value);
        setValues({ ...values, 'account': accounts[value-1].key, 'secret': accounts[value-1].secret});
    };
  return (
    <Page title="NFToken Tester">
        <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={2} mb={1}>
          <Typography variant="h4" gutterBottom>
            NFToken Tester
          </Typography>
          
          <ChooseAccountDialog
            accounts={accounts}
            selectedIdx={selectedIndex}
            onClose={handleChooseAccount}
            render={(open) => (
                <Button
                    variant="contained"
                    onClick={open}
                    startIcon={<ManageAccountsOutlinedIcon />}
                >
                    Account {accounts[selectedIndex-1].id}
                </Button>
                )}
          />
        </Stack>
        
        <Card sx={{ pl: 3, pb: 2 }}>
          <TesterControls
            values={values}
            setValues={setValues}
            onAccountInfo={onAccountInfo}
            />
        </Card>
        
      </Container>
    </Page>
  );
}
