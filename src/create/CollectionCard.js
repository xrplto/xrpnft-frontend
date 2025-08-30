import { useRouter } from 'next/router';
import { Card, Typography, Box, alpha } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function CollectionCard() {
    const router = useRouter();

    const handleCreateCollection = () => {
        router.push('/collection/create');
    };

    return (
        <Card
            sx={{
                p: 4,
                width: 1,
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                border: theme => `2px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${theme.palette.background.paper} 100%)`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s ease'
                },
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme => `0 20px 40px ${alpha(theme.palette.primary.main, 0.25)}`,
                    borderColor: theme => theme.palette.primary.main,
                    '&::before': {
                        transform: 'scaleX(1)'
                    },
                    '& .icon-wrapper': {
                        transform: 'rotate(15deg) scale(1.1)',
                        background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                    },
                    '& .icon': {
                        transform: 'scale(1.1)'
                    }
                },
            }}
            onClick={handleCreateCollection}
        >
            <Box
                className="icon-wrapper"
                sx={{
                    background: theme => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)}, ${theme.palette.primary.main})`,
                    borderRadius: '50%',
                    p: 3,
                    mb: 3,
                    position: 'relative',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: theme => `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: -8,
                        borderRadius: '50%',
                        background: theme => `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                        animation: 'pulse 2s infinite'
                    }
                }}
            >
                <LibraryAddIcon
                    className="icon"
                    sx={{
                        fontSize: 48,
                        color: theme => theme.palette.primary.contrastText,
                        transition: 'transform 0.4s ease',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}
                />
            </Box>
            <Typography 
                variant="h5" 
                align="center" 
                sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    background: theme => `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Create Collection
            </Typography>
            <Typography 
                variant="body2" 
                align="center" 
                sx={{ 
                    color: 'text.secondary',
                    px: 2,
                    lineHeight: 1.6
                }}
            >
                Start your NFT journey by creating a unique collection
            </Typography>
        </Card>
    );
}
