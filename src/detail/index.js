import { useEffect, useState } from 'react';

// Material
import {
    Container,
    Grid,
    Typography
} from '@mui/material';

import NFTOffersDetail from './NFTOffersDetail';
import NFTDetails from './NftDetails';

export default function Detail({token}) {
    const {
        name,
        image,
        uuid,
        description,
        collection,
        Issuer,
        TokenID
    } = token;

    console.log(token);
    
    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} md={5}>
                <NFTDetails token={token} />
            </Grid>
            <Grid item xs={12} md={7}>
                <NFTOffersDetail token={token} />
            </Grid>
        </Grid>
    );
  
  }
