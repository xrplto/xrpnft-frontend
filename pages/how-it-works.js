import Head from 'next/head';
import React, { useContext } from 'react';
import {
    Box,
    Container,
    styled,
    Toolbar,
    Typography,
    Stack,
    alpha,
    Button,
    useTheme
} from '@mui/material';

// Context
import { AppContext } from 'src/AppContext';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
`
);

const BackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 90%;
        position: absolute;
        background-size: cover;
        background-color: rgb(32, 34, 37);
        background-position: center center;
        opacity: 0.99;
        z-index: -1;
        filter: blur(8px);
        -webkit-mask: linear-gradient(rgb(255, 255, 255), transparent);
`
);

const StepCard = styled(Box)(
    ({ theme }) => `
        background: ${alpha(theme.palette.background.paper, 0.6)};
        border-radius: ${theme.shape.borderRadius * 2}px;
        padding: ${theme.spacing(3)};
        border: 1px solid ${alpha(theme.palette.divider, 0.1)};
        backdrop-filter: blur(10px);
        margin-bottom: ${theme.spacing(3)};
`
);

const StepNumber = styled(Box)(
    ({ theme }) => `
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: ${theme.palette.primary.main};
        color: ${theme.palette.primary.contrastText};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1.125rem;
        margin-bottom: ${theme.spacing(2)};
`
);

const HeroButton = styled(Button)(({ theme }) => ({
    padding: '12px 24px',
    fontWeight: 600,
    fontSize: '0.9375rem',
    textTransform: 'none',
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease',
    '&:hover': {
        transform: 'translateY(-1px)'
    }
}));

export default function HowItWorks({ ogp }) {
    const { darkMode } = useContext(AppContext);
    const theme = useTheme();
    
    return (
        <OverviewWrapper>
            <Head>
                <title>{ogp?.title || 'How It Works - XRPNFT'}</title>
                <meta name="description" content={ogp?.desc || 'Learn how XRPNFT\'s P2P marketplace works - no broker fees, interoperable offers, and secure on-chain transactions.'} />
                <meta property="og:title" content={ogp?.title || 'How It Works - XRPNFT'} />
                <meta property="og:description" content={ogp?.desc || 'Learn how XRPNFT\'s P2P marketplace works'} />
                <meta property="og:image" content={ogp?.imgUrl || 'https://xrpnft.com/static/ogp.png'} />
                <meta property="og:url" content={ogp?.url || 'https://xrpnft.com/how-it-works'} />
                <link rel="canonical" href={ogp?.canonical || 'https://xrpnft.com/how-it-works'} />
            </Head>

            <Toolbar id="back-to-top-anchor" />

            <BackgroundWrapper
                style={{
                    opacity: darkMode ? 0.2 : 0.3
                }}
            />

            <Header />

            <Container maxWidth="xl"> 
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                    <Box sx={{ mb: { xs: 4, md: 6 } }}>
                        <Typography
                            variant="h2"
                            fontWeight={700}
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em',
                                mb: 2
                            }}
                        >
                            How It Works
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '1rem', md: '1.25rem' },
                                fontWeight: 400,
                                mb: 3,
                                maxWidth: 600
                            }}
                        >
                            Trade XRP NFTs peer-to-peer with no middleman, no broker fees, and complete interoperability across marketplaces.
                        </Typography>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                            <HeroButton variant="contained" href="/collections">
                                Start Trading P2P
                            </HeroButton>
                            <HeroButton variant="outlined" href="/collections">
                                Explore Collections
                            </HeroButton>
                        </Stack>
                    </Box>

                    <Box sx={{ mt: { xs: 4, md: 6 } }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
                            <StepCard>
                                <StepNumber>1</StepNumber>
                                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                                    Connect Your Wallet
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Use Xaman, Crossmark, or Gem Wallet to securely connect to XRPNFT. Your wallet controls your assets entirely.
                                </Typography>
                            </StepCard>

                            <StepCard>
                                <StepNumber>2</StepNumber>
                                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                                    Browse Collections
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Explore verified collections with real-time floor prices, volume data, and market trends.
                                </Typography>
                            </StepCard>

                            <StepCard>
                                <StepNumber>3</StepNumber>
                                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                                    Create Offers
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Use NFTokenCreateOffer transactions to submit buy or sell offers with any XRPL token. Each offer reserves 0.2 XRP to prevent spam, ensuring genuine trading intent.
                                </Typography>
                            </StepCard>

                            <StepCard>
                                <StepNumber>4</StepNumber>
                                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                                    Accept & Settle
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Complete trades using NFTokenAcceptOffer transactions. All settlements happen directly on-chain with instant finality - no escrow or intermediary required.
                                </Typography>
                            </StepCard>
                        </Box>

                        {/* Trading Workflows Comparison */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" fontWeight={600} sx={{ mb: 4, textAlign: 'center' }}>
                                Trading Workflows Comparison
                            </Typography>
                            
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 4 }}>
                                {/* Direct Mode Workflow */}
                                <Box sx={{ 
                                    p: 4, 
                                    borderRadius: 3, 
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                    border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: 16, 
                                        right: 16, 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        backgroundColor: 'success.main',
                                        opacity: 0.8
                                    }} />
                                    
                                    <Typography variant="h5" fontWeight={700} color="success.main" sx={{ mb: 3 }}>
                                        Direct Mode (XRPNFT)
                                    </Typography>

                                    {/* Visual Workflow */}
                                    <Box sx={{ mb: 3 }}>
                                        <Stack spacing={3} alignItems="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', justifyContent: 'center' }}>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Box sx={{ 
                                                        width: 60, 
                                                        height: 60, 
                                                        borderRadius: '50%', 
                                                        backgroundColor: alpha(theme.palette.success.main, 0.2),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: `2px solid ${theme.palette.success.main}`
                                                    }}>
                                                        <Typography variant="h6" color="success.main" fontWeight={700}>S</Typography>
                                                    </Box>
                                                    <Typography variant="caption" fontWeight={600}>Seller</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    color: 'success.main',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 700
                                                }}>
                                                    ⟷
                                                </Box>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Box sx={{ 
                                                        width: 60, 
                                                        height: 60, 
                                                        borderRadius: '50%', 
                                                        backgroundColor: alpha(theme.palette.success.main, 0.2),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: `2px solid ${theme.palette.success.main}`
                                                    }}>
                                                        <Typography variant="h6" color="success.main" fontWeight={700}>B</Typography>
                                                    </Box>
                                                    <Typography variant="caption" fontWeight={600}>Buyer</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Box sx={{ fontSize: '1rem', color: 'success.main', fontWeight: 600, mb: 0.5 }}>
                                                    Direct On-Chain Settlement
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    NFTokenCreateOffer → NFTokenAcceptOffer
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                Seller keeps 100% of sale price
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                Works across all XRPL marketplaces
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                Always shows highest offer available
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                Supports all XRPL tokens
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                Instant settlement on acceptance
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                One platform to manage all offers
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'success.main' 
                                            }} />
                                            <Typography variant="body2" fontWeight={600}>
                                                Utilizes blockchain's power in removing intermediaries
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                                
                                {/* Brokered Mode Workflow */}
                                <Box sx={{ 
                                    p: 4, 
                                    borderRadius: 3, 
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                                    border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ 
                                        position: 'absolute', 
                                        top: 16, 
                                        right: 16, 
                                        width: 8, 
                                        height: 8, 
                                        borderRadius: '50%', 
                                        backgroundColor: 'error.main',
                                        opacity: 0.8
                                    }} />
                                    
                                    <Typography variant="h5" fontWeight={700} color="error.main" sx={{ mb: 3 }}>
                                        Brokered Mode (Traditional)
                                    </Typography>

                                    {/* Visual Workflow */}
                                    <Box sx={{ mb: 3 }}>
                                        <Stack spacing={3} alignItems="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center' }}>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Box sx={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        borderRadius: '50%', 
                                                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: `2px solid ${theme.palette.error.main}`
                                                    }}>
                                                        <Typography variant="body2" color="error.main" fontWeight={700}>S</Typography>
                                                    </Box>
                                                    <Typography variant="caption" fontWeight={600}>Seller</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    color: 'error.main',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 700
                                                }}>
                                                    ⟷
                                                </Box>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Box sx={{ 
                                                        width: 60, 
                                                        height: 60, 
                                                        borderRadius: 2, 
                                                        backgroundColor: alpha(theme.palette.error.main, 0.3),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: `2px solid ${theme.palette.error.main}`
                                                    }}>
                                                        <Typography variant="body2" color="error.main" fontWeight={700}>BR</Typography>
                                                    </Box>
                                                    <Typography variant="caption" fontWeight={600}>Broker</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    color: 'error.main',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 700
                                                }}>
                                                    ⟷
                                                </Box>
                                                <Box sx={{ textAlign: 'center', flex: 1 }}>
                                                    <Box sx={{ 
                                                        width: 50, 
                                                        height: 50, 
                                                        borderRadius: '50%', 
                                                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: `2px solid ${theme.palette.error.main}`
                                                    }}>
                                                        <Typography variant="body2" color="error.main" fontWeight={700}>B</Typography>
                                                    </Box>
                                                    <Typography variant="caption" fontWeight={600}>Buyer</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Box sx={{ fontSize: '1rem', color: 'error.main', fontWeight: 600, mb: 0.5 }}>
                                                    Complex Multi-Step Process
                                                </Box>
                                                <Typography variant="caption" color="text.secondary">
                                                    Broker controls matching & fees
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                Broker takes percentage fee
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                Third-party controls your trade
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                May hide higher offers they can't profit from
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                Limited token support (often XRP only)
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                May miss offers from other marketplaces
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                May not accept offers immediately
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ 
                                                width: 6, 
                                                height: 6, 
                                                borderRadius: '50%', 
                                                backgroundColor: 'error.main' 
                                            }} />
                                            <Typography variant="body2" color="error.main" fontWeight={600}>
                                                Prone to bugs in broker matching engine
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>

                        {/* XRPL Tokens Section - Commented out for now
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
                                Why Use XRPL Tokens for Offers?
                            </Typography>
                            
                            <Box sx={{ 
                                p: 4, 
                                borderRadius: 3, 
                                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                                border: `2px solid ${alpha(theme.palette.info.main, 0.3)}`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <Box sx={{ 
                                    position: 'absolute', 
                                    top: 16, 
                                    right: 16, 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    backgroundColor: 'info.main',
                                    opacity: 0.8
                                }} />
                                
                                <Typography variant="h5" fontWeight={700} color="info.main" sx={{ mb: 3 }}>
                                    Avoid Royalty Fees with XRPL Tokens
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 3 }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                            Smart Trading Strategy
                                        </Typography>
                                        <Stack spacing={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ 
                                                    width: 6, 
                                                    height: 6, 
                                                    borderRadius: '50%', 
                                                    backgroundColor: 'info.main' 
                                                }} />
                                                <Typography variant="body2">
                                                    Use meme coins and other XRPL tokens for offers
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ 
                                                    width: 6, 
                                                    height: 6, 
                                                    borderRadius: '50%', 
                                                    backgroundColor: 'info.main' 
                                                }} />
                                                <Typography variant="body2">
                                                    Bypass NFT creator royalty fees completely
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{ 
                                                    width: 6, 
                                                    height: 6, 
                                                    borderRadius: '50%', 
                                                    backgroundColor: 'info.main' 
                                                }} />
                                                <Typography variant="body2">
                                                    Keep 100% of trading value for yourself
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                            How It Works
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            When NFTs are minted with transfer fees (royalties), these fees only apply when trading with tokens that the creator has trust lines for. By using alternative XRPL tokens like meme coins, you can trade NFTs without triggering royalty payments to creators.
                                        </Typography>
                                        <Box sx={{ 
                                            mt: 2, 
                                            p: 2, 
                                            borderRadius: 1, 
                                            backgroundColor: alpha(theme.palette.info.main, 0.1),
                                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                                        }}>
                                            <Typography variant="caption" color="info.main" fontWeight={600}>
                                                💡 Pro Tip: Popular XRPL tokens include meme coins, DeFi tokens, and community tokens available on XRPL DEX
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        */}

                        <Box sx={{ 
                            background: alpha(theme.palette.primary.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center'
                        }}>
                            <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                                Why Choose P2P Trading?
                            </Typography>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ mb: 3 }}>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                    <Box sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '50%', 
                                        backgroundColor: alpha(theme.palette.success.main, 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <Typography variant="h6" color="success.main" fontWeight={700}>$</Typography>
                                    </Box>
                                    <Typography variant="h6" color="success.main" fontWeight={600}>
                                        Zero Fees
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Seller keeps 100% of sale price
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                    <Box sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '50%', 
                                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <Typography variant="h6" color="primary.main" fontWeight={700}>∞</Typography>
                                    </Box>
                                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                                        Universal Offers
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Native XRPL transactions work everywhere
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                    <Box sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: '50%', 
                                        backgroundColor: alpha(theme.palette.warning.main, 0.2),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 1
                                    }}>
                                        <Typography variant="h6" color="warning.main" fontWeight={700}>⚡</Typography>
                                    </Box>
                                    <Typography variant="h6" color="warning.main" fontWeight={600}>
                                        On-Chain Security
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        NFTokenAcceptOffer ensures atomicity
                                    </Typography>
                                </Box>
                            </Stack>
                            <HeroButton variant="contained" href="/collections" size="large">
                                Start Trading Now
                            </HeroButton>
                        </Box>
                    </Box>
                </Container>
            </Container>

            <ScrollToTop />

            <Footer />

        </OverviewWrapper>
    );
}

export async function getStaticProps() {
    const ogp = {
        canonical: 'https://xrpnft.com/how-it-works',
        title: 'How It Works - XRPNFT P2P Marketplace',
        url: 'https://xrpnft.com/how-it-works',
        imgUrl: 'https://xrpnft.com/static/ogp.png',
        desc: 'Learn how XRPNFT\'s peer-to-peer marketplace works. Trade XRP NFTs with no broker fees, universal offers, and secure on-chain transactions.'
    };

    return {
        props: { ogp }
    };
}