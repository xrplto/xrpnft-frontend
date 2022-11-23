// Material
import {
    Grid
} from '@mui/material';

// Utils
import { NFToken } from "src/utils/constants";

// Components
import NFTDetails from './NftDetails';
import NFTActions from './NFTActions';

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
