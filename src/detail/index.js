import { useEffect, useState } from 'react';

// Material
import {
    Container,
    Grid,
    Typography
} from '@mui/material';

import NFTOffersDetail from './NFTOffersDetail';
import NFTDetails from './NftDetails';

const xrpl = require("xrpl");

export default function Detail({data}) {
    const { tokenID, tokenURI } = useParams()
    console.log("tokenID", tokenID)
    const nft = xrpl.parseNFTokenID(tokenID)
    const uri = parseNFTUri(tokenURI)
    const { data, error } = useSWR(uri, fetcher)
    const nftdata = getNFTokenInfoNew(data, uri)
    // const [nftdata, setNftdata] = useState(null)
    console.log("data", data)

    console.log("nftdata", nftdata?.image)
    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item md={5}>
                {nftdata &&
                  <NFTDetails NFTokenID={tokenID} NFToken={nft} ParsedURI={uri} data={nftdata} />
                }
            </Grid>
            <Grid item md={7}>
                <NFTOffersDetail NFTokenID={tokenID} name={nftdata?.description?.name} Issuer={nft.Issuer} />
            </Grid>
        </Grid>
    );
  
  }
