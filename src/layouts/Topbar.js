import * as React from 'react';
//import { useContext, useState } from 'react'
import { useEffect } from 'react';
//import Context from '../Context'
// material
import { alpha, styled/*, useTheme*/ } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';
// components
//
import { Icon } from '@iconify/react';
import roundTransferWithinAStation from '@iconify/icons-ic/round-transfer-within-a-station';
import feedburnerIcon from '@iconify/icons-ps/feedburner';
import xrpIcon from '@iconify/icons-cryptocurrency/xrp';
import workspaceTrusted from '@iconify/icons-codicon/workspace-trusted';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
const StackStyle = styled(Stack)(({ theme }) => ({
    boxShadow: theme.customShadows.z0,
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
    backgroundColor: alpha(theme.palette.background.paper, 0.0),
    borderRadius: '0px',
    //backgroundColor: alpha("#00AB88", 0.99),
}));

// ----------------------------------------------------------------------
export default function Topbar() {
    useEffect(() => {
    }, []);

    return (
        <>
            <StackStyle direction="row" spacing={2} sx={{pl:10, pr:10, pt:1, pb:0.5}} alignItems="center">
                <Box sx={{ flexGrow: 1 }} />
                <Icon icon={feedburnerIcon} width="24" height="24" />
                <h5>Burnable</h5>
                <Icon icon={xrpIcon} width="24" height="24" />
                <h5>Only XRP</h5>
                <Icon icon={workspaceTrusted} width="24" height="24" />
                <h5>Trustline</h5>
                <Icon icon={roundTransferWithinAStation} width="24" height="24" />
                <h5>Transferable</h5>
            </StackStyle>
        </>
    );
}
