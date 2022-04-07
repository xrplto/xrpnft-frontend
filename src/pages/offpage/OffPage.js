import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Backdrop,
  Container,
  Grid,
} from '@mui/material';
import { FadeLoader } from 'react-spinners';
import Page from 'components/Page';
import NFTDescription from 'components/offpage/NftSalesInfo';
import NFTDetails from 'components/offpage/NftDetails';


export default function NFTInfo() {
  const [loading, setLoading] = useState(false);
  const {tokenID, tokenURI} = useParams()
  return (
    <Page title='NFT Info'>
      <Backdrop
        sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <FadeLoader color={'#00AB55'} size={50} />
      </Backdrop>
      <Container maxWidth='lg' sx={{ marginTop: '1vh' }}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item md={5}>
            <NFTDetails tokenID={tokenID} URI={tokenURI}/>
          </Grid>
          <Grid item md={7}>
            <NFTDescription tokenID={tokenID} URI={tokenURI}/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
