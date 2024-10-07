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
        <Container maxWidth="xl"> {/* Changed from "lg" to "xl" for a wider layout */}
            <Box py={8}>
                {' '}
                {/* Increased vertical padding */}
                {isMobile && status !== NFToken.SELL_WITH_MINT_BULK ? (
                    <Stack spacing={4}>
                        <NFTDetailsMobile nft={nft} />
                    </Stack>
                ) : (
                    <Grid
                        container
                        spacing={3} // Changed back to 3 for better spacing in the wider layout
                        justifyContent="center"
                        alignItems="flex-start"
                    >
                        <Grid item xs={12} md={5}> {/* Changed from md={6} to md={5} */}
                            <NFTDetails nft={nft} />
                        </Grid>
                        <Grid item xs={12} md={7}> {/* Changed from md={6} to md={7} */}
                            <Box mt={isMobile ? 4 : 0}>
                                {' '}
                                {/* Add top margin on mobile */}
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
