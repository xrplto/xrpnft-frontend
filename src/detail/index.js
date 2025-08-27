// Material
import { Box, Container } from '@mui/material';

// Utils
import { NFToken } from 'src/utils/constants';

// Components
import NFTActions from './NFTActions';
import NFTActionsBulk from './NFTActionsBulk';

export default function Detail({ nft }) {
    const { status } = nft;

    return (
        <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box py={3} sx={{ width: '100%', maxWidth: '1400px' }}>
                {status === NFToken.SELL_WITH_MINT_BULK ? (
                    <NFTActionsBulk nft={nft} />
                ) : (
                    <NFTActions nft={nft} />
                )}
            </Box>
        </Container>
    );
}
