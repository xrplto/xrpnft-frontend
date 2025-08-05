// Material
import { useMediaQuery, Grid, Box, Container } from '@mui/material';

// Utils
import { NFToken } from 'src/utils/constants';

// Components
import NFTDetails from './NFTDetails';
import NFTActions from './NFTActions';
import NFTActionsBulk from './NFTActionsBulk';

export default function Detail({ nft }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { status, costs } = nft;

    return (
        <Container maxWidth="xl"> {/* Changed from "lg" to "xl" for a wider layout */}
            <Box py={2}>
                <Grid
                    container
                    spacing={2} // Reduced spacing for closer components
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <Grid item xs={12} md={5}> {/* Changed from md={6} to md={5} */}
                        <NFTDetails nft={nft} />
                    </Grid>
                    <Grid item xs={12} md={7}> {/* Changed from md={6} to md={7} */}
                        {status === NFToken.SELL_WITH_MINT_BULK ? (
                            <NFTActionsBulk nft={nft} />
                        ) : (
                            <NFTActions nft={nft} />
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
