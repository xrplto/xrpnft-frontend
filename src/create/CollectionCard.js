import { Card, Stack, Typography, Box } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function CollectionCard({ onCreate }) {
    return (
        <Card
            sx={{
                p: 4,
                width: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => `0 8px 30px ${theme.palette.primary.main}33`,
                },
            }}
            onClick={onCreate}
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
                <LibraryAddIcon
                    sx={{
                        fontSize: 48,
                        color: (theme) => theme.palette.primary.contrastText,
                    }}
                />
            </Box>
            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                Create a new collection
            </Typography>
            <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                Start by creating a unique collection for your NFTs
            </Typography>
        </Card>
    );
}