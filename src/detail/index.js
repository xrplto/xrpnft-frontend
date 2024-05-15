// Material
import {
    useMediaQuery,
    Grid
} from '@mui/material';

// Utils
import { NFToken } from "src/utils/constants";

// Components
import NFTDetails from './NFTDetails';
import NFTActions from './NFTActions';
import NFTActionsBulk from './NFTActionsBulk';
import NFTDetailsMobile from './NFTDetailsMobile';

export default function Detail({nft}) {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
    const {
        status,
        costs
    } = nft;
    return (
        isMobile && status !== NFToken.SELL_WITH_MINT_BULK ?
            <NFTDetailsMobile nft={nft} />
            :
            <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={12} md={5.16}>{/* trying to fit 480px image, was 5/7 */}
                    <NFTDetails nft={nft} />
                </Grid>
                <Grid item xs={12} md={6.84}>
                    {status === NFToken.SELL_WITH_MINT_BULK ?
                        <NFTActionsBulk nft={nft} />
                    :
                        <NFTActions nft={nft} />
                    }
                </Grid>
            </Grid>
    );
}
