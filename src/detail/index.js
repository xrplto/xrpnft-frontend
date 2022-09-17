// Material
import {
    Grid
} from '@mui/material';

import NFTActions from './NFTActions';
import NFTDetails from './NftDetails';

export default function Detail({token}) {
    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} md={5}>
                <NFTDetails token={token} />
            </Grid>
            <Grid item xs={12} md={7}>
                <NFTActions token={token} />
            </Grid>
        </Grid>
    );
  
  }
