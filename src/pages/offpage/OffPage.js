import { useParams } from 'react-router-dom';
import { Container, Grid } from '@mui/material';
import Page from 'components/Page';
import NFTOffersDetail from 'components/offpage/NFTOffersDetail';
import NFTDetails from 'components/offpage/NftDetails';
import { fetcher, parseNFTokenId, parseNFTUri } from 'utils/utils';
import useSWR from 'swr'
import Page404 from 'pages/Page404';
import { getNFTokenInfoNew } from 'utils/utils';
import { getBuyOffers, getSellAndBuyOffers } from 'utils/tokenActions';

export default function NFTInfo() {
  const { tokenID, tokenURI } = useParams()

  const nft = parseNFTokenId(tokenID)
  const uri = parseNFTUri(tokenURI)

  const { data, error } = useSWR(uri, fetcher)
  const {buyOffers, errorBuyOffers} = useSWR(tokenID, getBuyOffers)
  const metadata = getNFTokenInfoNew(data, uri)
  return (
    <Page title='NFT Info'>
      {
        console.log({buyOffers, errorBuyOffers, data, error})
      }
      {
        error ?
          <Page404 /> :
          <Container maxWidth='lg' sx={{ marginTop: '1vh' }}>
            <Grid container spacing={2} justifyContent='center'>
              <Grid item md={5}>
                {
                  metadata &&
                  <NFTDetails NFTokenID={tokenID} NFToken={nft} ParsedURI={uri} data={metadata} />
                }
              </Grid>
              <Grid item md={7}>
                <NFTOffersDetail NFTokenID={tokenID} URI={tokenURI} />
              </Grid>
            </Grid>
          </Container>
      }
    </Page>
  );
}
