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
                return 'Mint NFTs on the XRP Ledger.';
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
                return 'Begin by choosing an existing collection or creating a new one.';
            case 'collection':
                return 'Enter collection info below.';
            case 'nft':
                return 'Enter NFT info below.';
            default:
                return '';
        }
    }, [state]);

    return (
        <Box
            sx={{
                px: { xs: 2, sm: 4 },
                py: { xs: 6, sm: 8 },
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}33 25%, transparent 25%)`,
                    backgroundSize: '20px 20px',
                    zIndex: 1,
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                    variant={isMobile ? 'h3' : 'h1'}
                    sx={{
                        my: 2,
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                        letterSpacing: '-0.5px',
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant={'h6'}
                    sx={{
                        opacity: 0.9,
                        maxWidth: '600px',
                        lineHeight: 1.6,
                    }}
                >
                    {subTitle}
                </Typography>
            </Container>
        </Box>
    );
}