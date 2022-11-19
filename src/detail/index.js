// Material
import {
    Grid
} from '@mui/material';

// Utils
import { NFToken } from "src/utils/constants";

// Components
import NFTDetails from './NftDetails';
import NFTActions from './NFTActions';
import NFTActionsBulk from './NFTActionsBulk';

export default function Detail({nft}) {
    const {
        status,
        costs
    } = nft;
    return (
        <Grid container spacing={2} justifyContent='center'>
            <Grid item xs={12} md={5}>
                <NFTDetails nft={nft} />
            </Grid>
            <Grid item xs={12} md={7}>
                {costs && costs.length > 0 && status === NFToken.SELL_WITH_MINT_BULK ?
                    <NFTActionsBulk nft={nft} />
                :
                    <NFTActions nft={nft} />
                }
            </Grid>
        </Grid>
    );
}
