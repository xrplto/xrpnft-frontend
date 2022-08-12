import useSWR from 'swr'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {parseNFTokenID} from 'xrpl';

// Material
import {
    Container,
    Grid
} from '@mui/material';

// Components
import Page from 'components/Page';
import Page404 from 'pages/Page404';

import NFTOffersDetail from '../components/offpage/NFTOffersDetail';
import NFTDetails from '../components/offpage/NftDetails';

// Utils
import { fetcher, parseNFTUri } from 'utils/utils';
import { getNFTokenInfo } from 'utils/utils';

export default function OffPage() {
    const { tokenID, tokenURI } = useParams()
    console.log("tokenID", tokenID)
    const nft = parseNFTokenID(tokenID)
    const uri = parseNFTUri(tokenURI)
    const { data, error } = useSWR(uri, fetcher)
    // const nftdata = getNFTokenInfo(tokenURI)
    const [nftdata, setNftdata] = useState(null)
  
    useEffect(()=>{
        setTimeout(async()=>{
            setNftdata(await getNFTokenInfo(tokenURI))
        }, 0)
    },[])

    if (error)
        return <Page404 />

    // if (!data) return <Typography variant='body1'>Loading...</Typography>
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
