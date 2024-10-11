import { useRouter } from 'next/router';
import { Card, Typography, Box, Stack, Tooltip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useState, useEffect } from 'react';

const CollectionTypeDot = ({ exists, color, type }) => (
    <Tooltip title={type.charAt(0).toUpperCase() + type.slice(1)} arrow>
        <Box
            sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: exists ? color : 'transparent',
                border: exists ? 'none' : `1px solid ${color}`,
                cursor: 'pointer',
            }}
        />
    </Tooltip>
);

export default function MyCollectionsCard({ collections }) {
    const router = useRouter();
    const [collectionTypes, setCollectionTypes] = useState({
        normal: false,
        bulk: false,
        sequence: false,
        random: false
    });

    useEffect(() => {
        const types = {
            normal: false,
            bulk: false,
            sequence: false,
            random: false
        };
        collections.forEach(collection => {
            if (types.hasOwnProperty(collection.type)) {
                types[collection.type] = true;
            }
        });
        setCollectionTypes(types);
    }, [collections]);

    const handleClick = () => {
        router.push('/collections');
    };

    if (collections.length === 0) {
        return null;
    }

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
                    boxShadow: (theme) => `0 8px 30px ${theme.palette.info.main}33`,
                },
                position: 'relative', // Added for absolute positioning of dots
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
                        backgroundColor: (theme) => theme.palette.info.main,
                        borderRadius: '50%',
                        p: 3,
                        mb: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'rotate(15deg)',
                        },
                    }}
                >
                    <FolderIcon
                        sx={{
                            fontSize: 48,
                            color: (theme) => theme.palette.info.contrastText,
                        }}
                    />
                </Box>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                    My Collections
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                    View and manage your collections
                </Typography>
            </Stack>
            <Stack 
                direction="row" 
                spacing={1} 
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                }}
            >
                <CollectionTypeDot exists={collectionTypes.normal} color="#1976d2" type="normal" />
                <CollectionTypeDot exists={collectionTypes.bulk} color="#ed6c02" type="bulk" />
                <CollectionTypeDot exists={collectionTypes.sequence} color="#2e7d32" type="sequence" />
                <CollectionTypeDot exists={collectionTypes.random} color="#9c27b0" type="random" />
            </Stack>
        </Card>
    );
}