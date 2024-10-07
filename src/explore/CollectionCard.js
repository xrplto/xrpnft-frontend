import { useState, useContext } from "react";
import { styled, useTheme, alpha, Box, CardMedia, Chip, Link, Stack, Typography, Skeleton, Card, CardContent } from '@mui/material';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { fIntNumber } from 'src/utils/formatNumber';
import { AppContext } from "src/AppContext";

const CardWrapper = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: 0,
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    overflow: 'visible',
    border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    marginTop: theme.spacing(3),
    
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2),
        outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        outlineOffset: '2px',
    }
}));

const GlassContent = styled(CardContent)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(10px)',
    borderTop: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
}));

export default function CollectionCard({ collectionData, type, account, handleRemove }) {
    const theme = useTheme();
    const { accountProfile } = useContext(AppContext);
    const isAdmin = accountProfile?.admin;
    const [loadingImg, setLoadingImg] = useState(true);

    const collection = collectionData.collection;
    const name = collection.name || 'No Name';
    const imgUrl = `https://s1.xrpnft.com/collection/${collection.logoImage}`;
    const collectionType = type.charAt(0).toUpperCase() + type.slice(1);

    const onImageLoaded = () => {
        setLoadingImg(false);
    };

    const handleRemoveCollection = (e) => {
        e.preventDefault();
        if (!isAdmin) return;
        if (!confirm(`Are you sure you want to remove "${name}"?`)) {
            return;
        }
        handleRemove(collection.id);
    };

    return (
        <Link href={`/account/${account}/collection${collectionType}/${collection.id}`} underline='none' sx={{ position: 'relative' }}>
            <CardWrapper
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 280,
                    aspectRatio: '9 / 14',
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 1,
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -4,
                        left: -4,
                        right: -4,
                        bottom: -4,
                        background: 'inherit',
                        borderRadius: 'inherit',
                        zIndex: -1,
                        filter: 'blur(8px)',
                    },
                }}
            >
                {isAdmin &&
                    <CloseIcon
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            zIndex: 1500
                        }}
                        onClick={(e) => handleRemoveCollection(e)}
                    />
                }
                <CardMedia
                    component={loadingImg ? 'div' : 'img'}
                    image={imgUrl}
                    loading={loadingImg.toString()}
                    alt={name}
                    sx={{
                        width: '100%',
                        flexGrow: 1,
                        objectFit: 'cover',
                        borderTopLeftRadius: theme.shape.borderRadius * 2,
                        borderTopRightRadius: theme.shape.borderRadius * 2,
                    }}
                />
                {loadingImg && (
                    <Skeleton
                        variant='rectangular'
                        sx={{
                            width: '100%',
                            flexGrow: 1,
                            borderTopLeftRadius: theme.shape.borderRadius * 2,
                            borderTopRightRadius: theme.shape.borderRadius * 2,
                        }}
                    />
                )}
                <img src={imgUrl} style={{ display: 'none' }} onLoad={onImageLoaded} />
                <GlassContent sx={{ padding: '12px', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100px' }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2,
                            fontSize: '0.8rem',
                        }}
                    >
                        {name}
                    </Typography>
                    
                    <Stack spacing={0.5} mt="auto">
                        <Stack direction="row" alignItems='center' justifyContent='space-between'>
                            <Typography variant='body2' color="text.secondary" fontSize="0.75rem">
                                {collectionData.nftCount} item{collectionData.nftCount !== 1 && 's'}
                            </Typography>
                            {collection.rarity_rank > 0 && (
                                <Chip
                                    variant="outlined"
                                    size="small"
                                    icon={<LeaderboardOutlinedIcon sx={{width: '10px'}} />}
                                    label={fIntNumber(collection.rarity_rank)}
                                    sx={{
                                        height: '18px',
                                        '& .MuiChip-label': {
                                            px: 0.5,
                                            fontSize: '0.6rem',
                                            fontWeight: 600,
                                        }
                                    }}
                                />
                            )}
                        </Stack>
                        <Typography variant='body2' color="text.secondary" fontSize="0.75rem">
                            {collectionData.nftsForSale} listed
                        </Typography>
                    </Stack>
                </GlassContent>
            </CardWrapper>
        </Link>
    );
}