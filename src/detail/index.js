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
            <Grid item md={5}>
                <NFTDetails token={token} />
            </Grid>
            <Grid item md={7}>
                <NFTOffersDetail token={token} />
            </Grid>
        </Grid>
    );
  
  }
