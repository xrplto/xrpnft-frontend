import axios from 'axios';
import { useRouter } from 'next/router';
import { memo, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { styled, Card, Stack, Typography, Button, Box, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';

const IconCover = styled('div')(
    ({ theme }) => `
        width: 72px;
        height: 52px;
        box-shadow: rgb(0 0 0 / 8%) 0px 5px 10px;
        background-color: ${theme.colors.alpha.white[70]};
        position: relative;
        overflow: hidden;
    `
);

const IconWrapper = styled('div')(
    ({ theme }) => `
        box-sizing: border-box;
        display: inline-block;
        position: relative;
        width: 70px;
        height: 50px;
        &:hover, &.Mui-focusVisible {
            z-index: 1;
            & .MuiImageBackdrop-root {
                opacity: 0.1;
            }
            & .MuiIconEditButton-root {
                opacity: 1;
            }
        }
  `
);

const IconImage = styled('img')(
    ({ theme }) => `
    position: absolute;
    inset: 0px;
    box-sizing: border-box;
    padding: 0px;
    border: none;
    margin: auto;
    display: block;
    width: 0px; height: 0px;
    min-width: 100%;
    max-width: 100%;
    min-height: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 8px;
  `
);

const NFTCard = memo(function NFTCard({ onCreate }) {
    const router = useRouter();
    const cardRef = useRef(null);
    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [collections, setCollections] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [hasBulkCollections, setHasBulkCollections] = useState(false);

    const handleExpand = useCallback(async () => {
        if (expanded === false && collections.length === 0) {
            openSnackbar(
                'You must first create a collection for NFTs.',
                'error'
            );
            return;
        }
        setExpanded(!expanded);
    }, [expanded, collections, openSnackbar]);

    const loadCollections = useCallback(() => {
        if (!account || !accountToken) {
            openSnackbar('Please login', 'error');
            return;
        }

        const BASE_URL = 'https://api.xrpnft.com/api';
        axios
            .get(`${BASE_URL}/collection/query?account=${account}`, {
                headers: { 'x-access-token': accountToken }
            })
            .then((res) => {
                try {
                    if (res.status === 200 && res.data) {
                        const ret = res.data;
                        if (ret.collections.length > 0) {
                            const filteredCollections = ret.collections.filter(collection => 
                                !["bulk", "random", "sequence"].includes(collection.type)
                            );
                            setCollections(filteredCollections);
                            const hasBulkTypes = ret.collections.some(collection => 
                                ["bulk", "random", "sequence"].includes(collection.type)
                            );
                            setHasBulkCollections(hasBulkTypes);
                        }
                    }
                } catch (error) {
                    console.error('Error processing collections:', error);
                }
            })
            .catch((err) => {
                console.error('Error fetching collections:', err);
            });
    }, [account, accountToken, openSnackbar]);

    useEffect(() => {
        loadCollections();
    }, [account]);

    // Handle click outside to close expanded view
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target) && expanded) {
                setExpanded(false);
            }
        };

        if (expanded) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [expanded]);

    return (
        <Card
            ref={cardRef}
            sx={{
                p: 4,
                width: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: expanded ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: (theme) => theme.palette.background.paper,
                border: (theme) => `1px solid ${expanded ? theme.palette.primary.main : theme.palette.divider}`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: (theme) => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    opacity: expanded ? 1 : 0,
                    transition: 'opacity 0.3s',
                },
                '&:hover': expanded ? {} : {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: (theme) => theme.shadows[8],
                    borderColor: (theme) => theme.palette.primary.main,
                },
            }}
            onClick={(e) => {
                // Toggle expansion on click
                handleExpand();
            }}
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
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                        borderRadius: '50%',
                        p: 3,
                        mb: 3,
                        display: 'inline-flex',
                        boxShadow: (theme) => theme.shadows[4],
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'rotate(15deg)',
                        },
                    }}
                >
                    <UploadIcon
                        sx={{
                            fontSize: 48,
                            color: 'white',
                        }}
                    />
                </Box>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                    Create a single NFT
                </Typography>
                <Typography variant="body1" align="center" sx={{ color: 'text.secondary' }}>
                    Mint a unique NFT in your collection
                </Typography>
            </Stack>
            {expanded && (
                <Box sx={{ 
                    mt: 3, 
                    pt: 3, 
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            Choose Collection:
                        </Typography>
                        <IconButton 
                            size="small" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(false);
                            }}
                            sx={{ color: 'text.secondary' }}
                            aria-label="Close collection selection"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    {collections.map(({ name, logoImage }, index) => (
                        <Box
                            key={index}
                            component="button"
                            aria-label={`Select ${name} collection`}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '100%',
                                mb: 1.5,
                                p: 1.5,
                                borderRadius: 1.5,
                                border: (theme) => `1px solid ${theme.palette.divider}`,
                                backgroundColor: (theme) => theme.palette.background.default,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: (theme) => theme.palette.action.hover,
                                    borderColor: (theme) => theme.palette.primary.main,
                                    transform: 'translateX(4px)',
                                    boxShadow: (theme) => theme.shadows[2],
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (onCreate && typeof onCreate === 'function') {
                                    onCreate(name);
                                }
                            }}
                        >
                            <IconCover>
                                <IconWrapper>
                                    <IconImage
                                        src={`https://s1.xrpnft.com/collection/${logoImage}`}
                                        alt={`${name} collection`}
                                        loading="lazy"
                                    />
                                </IconWrapper>
                            </IconCover>
                            <Typography variant="body2" sx={{ ml: 2, fontWeight: 500, color: 'text.primary' }}>
                                {name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Card>
    );
});

export default NFTCard;