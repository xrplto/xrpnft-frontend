import axios from 'axios';
import { useRouter } from 'next/router';
import { memo, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { styled, Card, Stack, Typography, Button, Box, IconButton, alpha } from '@mui/material';
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
                height: expanded ? 'auto' : '280px',
                minHeight: expanded ? '380px' : 'unset',
                display: 'flex',
                flexDirection: 'column',
                cursor: expanded ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
                border: theme => `2px solid ${expanded ? theme.palette.secondary.main : alpha(theme.palette.divider, 0.1)}`,
                background: theme => `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.02)} 0%, ${theme.palette.background.paper} 100%)`,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: theme => `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    transform: expanded ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s ease'
                },
                '&:hover': expanded ? {} : {
                    transform: 'translateY(-8px)',
                    boxShadow: theme => `0 20px 40px ${alpha(theme.palette.secondary.main, 0.25)}`,
                    borderColor: theme => theme.palette.secondary.main,
                    '&::before': {
                        transform: 'scaleX(1)'
                    },
                    '& .icon-wrapper': {
                        transform: 'rotate(-15deg) scale(1.1)',
                        background: theme => `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
                    },
                    '& .icon': {
                        transform: 'scale(1.1)'
                    }
                },
            }}
            onClick={(e) => {
                if (!expanded) {
                    handleExpand();
                }
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
                    className="icon-wrapper"
                    sx={{
                        background: theme => `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.9)}, ${theme.palette.secondary.main})`,
                        borderRadius: '50%',
                        p: 3,
                        mb: 3,
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        boxShadow: theme => `0 8px 24px ${alpha(theme.palette.secondary.main, 0.3)}`,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            background: theme => `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
                            animation: 'pulse 2s infinite'
                        }
                    }}
                >
                    <UploadIcon
                        className="icon"
                        sx={{
                            fontSize: 48,
                            color: theme => theme.palette.secondary.contrastText,
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
                        background: theme => `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Create Single NFT
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
                    Mint a unique NFT in your existing collection
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