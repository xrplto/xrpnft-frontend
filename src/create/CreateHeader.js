import { useMemo } from 'react';

// Material
import {
    Box,
    Container,
    Typography,
    useTheme,
    useMediaQuery
} from '@mui/material';

export default function CreateHeader({ state }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const title = useMemo(() => {
        switch (state) {
            case '':
                return 'Create NFTs on the XRP Ledger.';
            case 'collection':
                return 'Create a collection';
            case 'nft':
                return 'Create a NFT';
            default:
                return '';
        }
    }, [state]);

    const subTitle = useMemo(() => {
        switch (state) {
            case '':
                return 'Start by selecting or creating a new collection.';
            case 'collection':
                return 'Enter collection info below.';
            case 'nft':
                return 'Enter NFT info below.';
            default:
                return '';
        }
    }, [state]);

    return (
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
            <Container maxWidth="md">
                <Typography variant={isMobile ? 'h3' : 'h1'} sx={{ my: 2 }}>
                    {title}
                </Typography>
                <Typography variant={'p7'}>{subTitle}</Typography>
            </Container>
        </Box>
    );
}
