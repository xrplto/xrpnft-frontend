// Material
import {
    Grid
} from '@mui/material';

import NFTActions from './NFTActions';
import NFTDetails from './NftDetails';

export default function Detail({nft}) {
    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} md={5}>
                <NFTDetails nft={nft} />
            </Grid>
            <Grid item xs={12} md={7}>
                <NFTActions nft={nft} />
            </Grid>
        </Grid>
    );
  
  }
