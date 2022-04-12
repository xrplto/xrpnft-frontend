import { useParams } from 'react-router-dom';
import { Container, Grid, } from '@mui/material';
import Page from 'components/Page';
import NFTDescription from 'components/offpage/NFTOffersDetail';
import NFTDetails from 'components/offpage/NftDetails';


export default function NFTInfo() {
  const { tokenID, tokenURI } = useParams()
  return (
    <Page title='NFT Info'>
      <Container maxWidth='lg' sx={{ marginTop: '1vh' }}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item md={5}>
            <NFTDetails tokenID={tokenID} URI={tokenURI} />
          </Grid>
          <Grid item md={7}>
            <NFTDescription tokenID={tokenID} URI={tokenURI} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
