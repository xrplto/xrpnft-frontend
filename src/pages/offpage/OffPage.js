import { useParams } from 'react-router-dom';
import { Container, Grid, Typography, } from '@mui/material';
import Page from 'components/Page';
import NFTOffersDetail from 'components/offpage/NFTOffersDetail';
import NFTDetails from 'components/offpage/NftDetails';
import { fetcher, parseNFTokenId, parseNFTUri } from 'utils/utils';
import useSWR from 'swr'
import Page404 from 'pages/Page404';



export default function NFTInfo() {
  const { tokenID, tokenURI } = useParams()

  const nft = parseNFTokenId(tokenID)
  const uri = parseNFTUri(tokenURI)

  const { data, error } = useSWR(uri, fetcher)


  return (
    <Page title='NFT Info'>
      {
        error && <Page404 />
      }
      {
        data &&
        <Container maxWidth='lg' sx={{ marginTop: '1vh' }}>
          <Grid container spacing={2} justifyContent='center'>
            <Grid item md={5}>
              <NFTDetails NFTokenID={tokenID} URI={tokenURI} NFToken={nft} />
            </Grid>
            <Grid item md={7}>
              <NFTOffersDetail tokenID={tokenID} URI={tokenURI} />
            </Grid>
          </Grid>
        </Container>
      }
    </Page>
  );
}
