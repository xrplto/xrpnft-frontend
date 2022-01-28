//import { useEffect, useState } from 'react';
import { useState } from 'react';
//import PropTypes from 'prop-types';
//import { Icon } from '@iconify/react';
// material
//import { alpha, useTheme, styled } from '@mui/material/styles';
import { 
    Button, 
    Paper, 
    Dialog, 
    DialogTitle, 
    DialogActions, 
    Divider,
} from '@mui/material';
// ----------------------------------------------------------------------
const xrpl = require("xrpl");
async function getAccountInfo(showResult, showWaitDialog, values) {
    showWaitDialog(true);
    let result;
    try {
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
        await client.connect();

        const response = await client.request({
            "command": "account_info",
            "account": values.account,
            "ledger_index": "validated"
        });
        result = response;
        console.log(response);
        client.disconnect();
    } catch (error) {
        console.log(error);
    }
    showWaitDialog(false);

    showResult(result);
}
// ----------------------------------------------------------------------
export default function AccountInfoDialog({ values, setLoading, render }) {
    const [open, setOpen] = useState(false);
    
    const onAccountInfo = () => {
        getAccountInfo(showResult, setLoading, values);
     };

    const showResult = (result) => {

        setOpen(true);
     };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleOk = () => {
        handleClose();
    };

    return (
        <>
        {render(onAccountInfo)}
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Account Info</DialogTitle>
            <Divider />
            <Paper style={{maxHeight: 320, overflow: 'auto', borderRadius:0}}>
                
            </Paper>
            <Divider />
            <Button onClick={handleOk}>Ok</Button>
        </Dialog>
        </>
    );
}