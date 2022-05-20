import { useEffect, useState } from "react";
import { getTokens } from 'utils/tokenActions';
import Page from "components/Page";
import AccountNfts from "components/NFTLists/AccountNfts";
import { useParams } from 'react-router-dom';
import AccountTxHistory from "components/account/AccountTxHistory";
import { getAccountTxHistory } from 'utils/tokenActions';
import PageError from 'pages/PageError';
import useSWR from 'swr'
import { Box, Container, Grid, Typography } from "@mui/material";

function useTxHistory(_param) {
  return useSWR(_param, getAccountTxHistory)
}

export default function Account() {
  const { key } = useParams()

  return (
    <Page title="Account-Info">
      {
          <Box>
            <AccountNfts account={key} />
            <AccountTxHistory account={key} />
          </Box>
      }
    </Page>
  );
}
