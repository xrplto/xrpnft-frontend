import { useParams } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';
import Page from 'components/Page';
import NFTOffersDetail from 'components/offpage/NFTOffersDetail';
import NFTDetails from 'components/offpage/NftDetails';
import { fetcher, parseNFTUri } from 'utils/utils';
import useSWR from 'swr'
import Page404 from 'pages/Page404';
import { getNFTokenInfo } from 'utils/utils';
import { useEffect, useState } from 'react';
const xrpl = require("xrpl");

export default function NFTInfo() {
  const { tokenID, tokenURI } = useParams()
  const nft = xrpl.parseNFTokenID(tokenID)
  const uri = parseNFTUri(tokenURI)
  const { data, error } = useSWR(uri, fetcher)
  const [nftdata, setNftdata] = useState(null)
  console.log("data", data)
  useEffect(()=>{
    setTimeout(async()=>{
      setNftdata(await getNFTokenInfo(tokenURI))
    }, 0)
  },[])
  if (error) return <Page404 />
  if (!data) return <Typography variant='body1'>Loading...</Typography>
  console.log("nftdata", nftdata?.image)
  return (
    nftdata ?
    <Page title='NFT Info'>
      <Container maxWidth='lg' sx={{ marginTop: '1vh' }}>
        <Grid container spacing={2} justifyContent='center'>
          <Grid item md={5}>
            { 
              nftdata &&
              <NFTDetails NFTokenID={tokenID} NFToken={nft} ParsedURI={uri} data={nftdata} />
              
            }
          </Grid>
          <Grid item md={7}>
            <NFTOffersDetail NFTokenID={tokenID} name={nftdata?.description?.name} Issuer={nft.Issuer} />
          </Grid>
        </Grid>
      </Container>
    </Page>
    : null
  );
  
  }
