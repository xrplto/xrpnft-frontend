// import { useEffect } from "react";
import { getTokens } from 'utils/tokenActions';
import Page from "components/Page";
import AccountNfts from "components/NFTLists/AccountNfts";
import { useParams } from 'react-router-dom';
import AccountTxHistory from "components/account/AccountTxHistory";
import { getAccountTxHistory } from 'utils/tokenActions';
import PageError from 'pages/PageError';
import useSWR from 'swr'
import { Container, Grid, Typography } from "@mui/material";

function useTxHistory(_param) {
  return useSWR(_param, getAccountTxHistory)
}

export default function Account() {
  const { key } = useParams()
  const { data: nfts, isLoading } = useSWR(key, getTokens);
  const txHistory = useTxHistory(key)
  // if (nf) return <PageError message={nfts.error.message} />
  if (!nfts || !txHistory) return <Typography variant='body1'>Loading...</Typography>
  return (
    <Page title="Account-Info">
      <AccountNfts nfts={nfts} />
      <AccountTxHistory txHistory={txHistory.data} />
    </Page>
  );
}
