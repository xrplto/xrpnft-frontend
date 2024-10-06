// Material
import { useMediaQuery, Grid, Box, Container, Stack } from '@mui/material';

// Utils
import { NFToken } from 'src/utils/constants';

// Components
import NFTDetails from './NFTDetails';
import NFTActions from './NFTActions';
import NFTActionsBulk from './NFTActionsBulk';
import NFTDetailsMobile from './NFTDetailsMobile';

export default function Detail({ nft }) {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const { status, costs } = nft;

    return (
        <Container maxWidth="lg">
            <Box py={8}> {/* Increased vertical padding */}
                {isMobile && status !== NFToken.SELL_WITH_MINT_BULK ? (
                    <Stack spacing={4}>
                        <NFTDetailsMobile nft={nft} />
                    </Stack>
                ) : (
                    <Grid
                        container
                        spacing={6} // Increased spacing between grid items
                        justifyContent="center"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12} md={5}>
                            <NFTDetails nft={nft} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <Box mt={isMobile ? 4 : 0}> {/* Add top margin on mobile */}
                                {status === NFToken.SELL_WITH_MINT_BULK ? (
                                    <NFTActionsBulk nft={nft} />
                                ) : (
                                    <NFTActions nft={nft} />
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Container>
    );
}
