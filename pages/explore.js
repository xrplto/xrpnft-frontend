import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import {
  Box,
  Container,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  styled,
  alpha,
  Link,
  Chip,
  Stack,
  Toolbar
} from '@mui/material';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { useContext } from 'react';
import { AppContext } from '../src/AppContext';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import ScrollToTop from '../src/components/ScrollToTop';

// Styled Components
const OverviewWrapper = styled(Box)(({ theme }) => ({
  flex: 1
}));

const BackgroundWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '90%',
  position: 'absolute',
  backgroundSize: 'cover',
  backgroundColor: 'rgb(32, 34, 37)',
  backgroundPosition: 'center center',
  opacity: 0.99,
  zIndex: -1,
  filter: 'blur(8px)',
  WebkitMask: 'linear-gradient(rgb(255, 255, 255), transparent)'
}));

// NFT Card styled exactly like the collection pages
const CardWrapper = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  backdropFilter: 'blur(20px)',
  background: alpha(theme.palette.background.paper, 0.15),
  padding: 0,
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
  boxShadow: 'none',
  position: 'relative',
  height: 'auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',

  '&:hover': {
    boxShadow: 'none',
    background: alpha(theme.palette.background.paper, 0.25),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
    outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
    outlineOffset: '2px',
    zIndex: 10
  }
}));

// Sequence number overlay style
const SequenceOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  color: theme.palette.text.primary,
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`
}));

export default function Explore() {
  const { darkMode } = useContext(AppContext);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchNFTs = async (pageNum = 0) => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.xrpnft.com/api/nfts', {
        filter: 0,
        filterAttrs: [],
        flag: 0,
        limit: 32,
        page: pageNum,
        search: "",
        subFilter: ""
      });

      if (response.data.result === 'success' && response.data.nfts) {
        if (pageNum === 0) {
          setNfts(response.data.nfts);
        } else {
          setNfts(prev => [...prev, ...response.data.nfts]);
        }
        setHasMore(response.data.nfts.length === 32);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs(0);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNFTs(nextPage);
  };

  // Use first NFT's image for background
  const backgroundImage = nfts.length > 0 && nfts[0]?.thumbnail?.small 
    ? `https://s2.xrpnft.com/d1/${nfts[0].thumbnail.small}`
    : null;

  return (
    <OverviewWrapper>
      <Head>
        <title>Explore NFTs | XRPNFT</title>
        <meta name="description" content="Explore NFTs on the XRP Ledger" />
      </Head>

      <BackgroundWrapper
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          opacity: darkMode ? 0.2 : 0.3
        }}
      />

      <Header />

      <Toolbar id="back-to-top-anchor" />

      <Container maxWidth="xl">
        <Container maxWidth="lg" sx={{ py: 0 }}>
        <Box sx={{ py: 0 }}>
          <Box 
            sx={{ 
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              borderBottom: theme => `1px solid ${alpha(theme.palette.divider, 0.06)}`,
              background: theme => `linear-gradient(90deg, 
                ${alpha(theme.palette.primary.main, 0.03)} 0%, 
                ${alpha(theme.palette.background.paper, 0.5)} 50%,
                ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
              backdropFilter: 'blur(40px)',
              mb: 4,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: theme => `linear-gradient(90deg, 
                  transparent 0%, 
                  ${alpha(theme.palette.primary.main, 0.2)} 10%,
                  transparent 90%)`
              }
            }}
          >
            <Box sx={{ 
              px: { xs: 2, sm: 3, md: 4 }, 
              py: { xs: 2.5, sm: 3.5 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 }
            }}>
              <Box sx={{ 
                width: 3,
                height: 40,
                background: theme => `linear-gradient(180deg, 
                  ${theme.palette.primary.main} 0%, 
                  ${alpha(theme.palette.primary.main, 0.3)} 100%)`,
                borderRadius: 1
              }} />
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 300,
                    fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
                    letterSpacing: '-0.03em',
                    display: 'flex',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                    gap: { xs: 0.5, sm: 1 }
                  }}
                >
                  <Box component="span" sx={{ 
                    fontWeight: 800,
                    background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Explore
                  </Box>
                  <Box component="span" sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                    color: 'text.secondary',
                    fontWeight: 300,
                    letterSpacing: '-0.01em',
                    opacity: 0.9
                  }}>
                    Live NFT events from XRP Ledger
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between',
            width: '100vw',
            position: 'relative',
            left: '50%',
            right: '50%',
            marginLeft: '-50vw',
            marginRight: '-50vw',
            px: { xs: 0.75, sm: 1, md: 1.25 },
            '&::after': {
              content: '""',
              flex: 'auto'
            }
          }}>
            {nfts.map((nft, index) => {
              // Get the thumbnail image URL directly
              let imageUrl = '';
              if (nft.thumbnail?.small) {
                imageUrl = `https://s2.xrpnft.com/d1/${nft.thumbnail.small}`;
              } else if (nft.thumbnail?.big) {
                imageUrl = `https://s2.xrpnft.com/d1/${nft.thumbnail.big}`;
              } else if (nft.files?.[0]?.thumbnail?.small) {
                imageUrl = `https://s2.xrpnft.com/d1/${nft.files[0].thumbnail.small}`;
              } else if (nft.files?.[0]?.thumbnail?.big) {
                imageUrl = `https://s2.xrpnft.com/d1/${nft.files[0].thumbnail.big}`;
              } else if (nft.dfile?.image) {
                imageUrl = `https://s2.xrpnft.com/d1/${nft.dfile.image}`;
              } else if (nft.files?.[0]?.dfile) {
                imageUrl = `https://s2.xrpnft.com/d1/${nft.files[0].dfile}`;
              }
              
              // Ensure name is a string
              let rawName = 'Unnamed NFT';
              if (nft.name && typeof nft.name === 'string') {
                rawName = nft.name;
              } else if (nft.meta?.name && typeof nft.meta.name === 'string') {
                rawName = nft.meta.name;
              } else if (nft.meta?.name && typeof nft.meta.name === 'object') {
                // Handle case where name might be an object
                rawName = 'Unnamed NFT';
              }
              
              // Simplify name if it matches pattern "CollectionName #Number" or "CollectionName Number"
              const simplifyName = (fullName) => {
                // Match patterns like "Wonkazz 200", "Fuzzybear #2222", "Collection Name #123"
                const patterns = [
                  /^.*\s+#(\d+)$/,  // Matches "Name #123"
                  /^.*\s+(\d+)$/,   // Matches "Name 123"
                ];
                
                for (const pattern of patterns) {
                  const match = fullName.match(pattern);
                  if (match) {
                    return `#${match[1]}`;
                  }
                }
                return fullName;
              };
              
              const nftName = simplifyName(rawName);
              
              // Ensure collection name is a string
              let collectionName = '';
              if (typeof nft.collection === 'string') {
                collectionName = nft.collection;
              } else if (nft.collection?.name && typeof nft.collection.name === 'string') {
                collectionName = nft.collection.name;
              }
              
              return (
                <Box
                  key={nft._id || `nft-${index}`}
                  sx={{
                    width: {
                      xs: 'calc((100% - 8px) / 2)',      // 2 per row on mobile
                      sm: 'calc((100% - 36px) / 4)',     // 4 per row on small  
                      md: 'calc((100% - 64px) / 5)',     // 5 per row on medium
                      lg: 'calc((100% - 96px) / 7)',     // 7 per row on large
                      xl: 'calc((100% - 240px) / 13)'    // 13 per row on xl
                    },
                    mb: { xs: 1, sm: 1.5, md: 2, lg: 2, xl: 2.5 },
                    display: 'flex'
                  }}
                >
                  <CardWrapper>
                    <Link
                      href={`/nft/${nft.NFTokenID || nft._id}`}
                      underline="none"
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}
                    >
                      <Box sx={{ aspectRatio: '1', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                        {imageUrl ? (
                          <CardMedia
                            component="img"
                            height="250"
                            image={imageUrl}
                            alt={nftName}
                            sx={{ 
                              objectFit: 'cover',
                              backgroundColor: 'background.default',
                              width: '100%',
                              height: '100%',
                              display: 'block'
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            height="250"
                            image="/static/nft_no_image.webp"
                            alt="No image available"
                            sx={{ 
                              objectFit: 'cover',
                              backgroundColor: 'background.default',
                              width: '100%',
                              height: '100%',
                              display: 'block'
                            }}
                            loading="lazy"
                          />
                        )}
                        {nft.MasterSequence && (
                          <SequenceOverlay>
                            #{nft.MasterSequence}
                          </SequenceOverlay>
                        )}
                      </Box>
                      <CardContent sx={{ 
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        flexGrow: 0,
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {/* Name and Rank Row */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Typography 
                            variant="body2" 
                            component="div" 
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}
                          >
                            {String(nftName)}
                          </Typography>
                          {nft.rarity_rank && nft.rarity_rank > 0 && (
                            <Chip
                              size="small"
                              icon={<LeaderboardOutlinedIcon sx={{ fontSize: 12 }} />}
                              label={`#${nft.rarity_rank}`}
                              sx={{ 
                                height: 18,
                                fontSize: '0.65rem',
                                '& .MuiChip-icon': { marginLeft: '4px' }
                              }}
                            />
                          )}
                        </Stack>
                        
                        {/* Price and Offer Row */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontWeight: 600,
                              color: nft.cost?.amount ? 'text.primary' : 'text.secondary',
                              fontSize: '0.75rem'
                            }}
                          >
                            {nft.cost && nft.cost.amount && Number(nft.cost.amount) > 0 
                              ? `${String(nft.cost.amount).slice(0, 8)} ${String(nft.cost.currency || 'XRP')}`
                              : 'Unlisted'
                            }
                          </Typography>
                          {nft.costb && nft.costb.amount && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'success.main',
                                fontSize: '0.65rem'
                              }}
                            >
                              Offer: {String(nft.costb.amount).slice(0, 6)}
                            </Typography>
                          )}
                        </Stack>
                        
                        {/* Update event */}
                        {nft.updateEvent && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.6rem',
                              textAlign: 'right'
                            }}
                          >
                            Updated: {nft.updateEvent}
                          </Typography>
                        )}
                      </CardContent>
                    </Link>
                  </CardWrapper>
                </Box>
              );
            })}
          </Box>

          {loading && (
            <Box display="flex" justifyContent="center" my={4} width="100%">
              <CircularProgress />
            </Box>
          )}
          
          {!loading && hasMore && nfts.length > 0 && (
            <Box display="flex" justifyContent="center" mt={4} width="100%">
              <Button onClick={loadMore} variant="contained" color="primary">
                Load More
              </Button>
            </Box>
          )}
        </Box>
        </Container>
      </Container>

      <ScrollToTop />
      
      <Footer />

    </OverviewWrapper>
  );
}