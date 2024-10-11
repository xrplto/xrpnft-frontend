import { useRouter } from 'next/router';
import { Card, Typography, Box, Stack } from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';

export default function BulkCollectionsCard({ hasBulkCollections }) {
    const router = useRouter();

    if (!hasBulkCollections) {
        return null;
    }

    const handleClick = () => {
        router.push('/bulks');
    };

    return (
        <Card
            sx={{
                p: 4,
                width: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => `0 8px 30px ${theme.palette.primary.main}33`,
                },
            }}
            onClick={handleClick}
        >
            <Stack
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                        borderRadius: '50%',
                        p: 3,
                        mb: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'rotate(15deg)',
                        },
                    }}
                >
                    <CollectionsIcon
                        sx={{
                            fontSize: 48,
                            color: (theme) => theme.palette.primary.contrastText,
                        }}
                    />
                </Box>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Bulk Collections
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                    Manage your bulk, random, and sequence collections
                </Typography>
            </Stack>
        </Card>
    );
}