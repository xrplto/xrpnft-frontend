import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AppContext } from 'src/AppContext';

// Material
import { Box, Button, styled, Toolbar, Container, alpha, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Components
import Header from 'src/components/Header';
import ScrollToTop from 'src/components/ScrollToTop';
import Footer from 'src/components/Footer';

import CreateHeader from 'src/create/CreateHeader';
import CreateContainer from 'src/create/CreateContainer';
import CollectionCard from 'src/create/CollectionCard';
import NFTCard from 'src/create/NFTCard';
import BulkCollectionsCard from 'src/create/BulkCollectionsCard';
import MyCollectionsCard from 'src/create/MyCollectionsCard';

import CreateCollection from 'src/collection/create';
import Minting from 'src/minting';

const CreateWrapper = styled(Box)(
    ({ theme }) => `
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: transparent;
        position: relative;
`
);

const BlackBackgroundWrapper = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #000000;
        z-index: -1;
`
);

const BackButton = ({ onClick }) => (
    <Button 
        startIcon={<ArrowBackIcon />}
        variant="outlined" 
        onClick={onClick}
        sx={{
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.25,
            mb: 3,
            borderColor: theme => alpha(theme.palette.primary.main, 0.3),
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: theme => theme.palette.primary.main,
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
                transform: 'translateX(-4px)'
            }
        }}
    >
        Back to Options
    </Button>
);

export default function Create() {
    const router = useRouter();
    const [state, setState] = useState('');
    const [collectionName, setCollectionName] = useState(null);
    const [collections, setCollections] = useState([]);
    const [hasBulkCollections, setHasBulkCollections] = useState(false);
    const { accountProfile, darkMode } = useContext(AppContext);
    
    console.log('Create component rendered, current state:', state, 'collectionName:', collectionName);
    
    // Handle query parameters on mount
    useEffect(() => {
        if (router.query.action === 'nft') {
            setState('nft');
            if (router.query.collection) {
                // Find the collection name from slug if available
                const foundCollection = collections.find(c => c.slug === router.query.collection);
                setCollectionName(foundCollection?.name || router.query.collection);
            }
        } else if (router.query.action === 'collection') {
            setState('collection');
        }
    }, [router.query, collections]);
    
    useEffect(() => {
        if (accountProfile?.account && accountProfile?.token) {
            const BASE_URL = 'https://api.xrpnft.com/api';
            axios
                .get(`${BASE_URL}/collection/query?account=${accountProfile.account}`, {
                    headers: { 'x-access-token': accountProfile.token }
                })
                .then((res) => {
                    if (res.status === 200 && res.data) {
                        setCollections(res.data.collections || []);
                        const hasBulkTypes = res.data.collections?.some(collection => 
                            ["bulk", "random", "sequence"].includes(collection.type)
                        ) || false;
                        setHasBulkCollections(hasBulkTypes);
                    }
                })
                .catch((err) => {
                    console.log('Error loading collections:', err);
                });
        }
    }, [accountProfile]);
    
    const handleNFTCreate = useCallback((selectedCollectionName) => {
        setCollectionName(selectedCollectionName);
        setState('nft');
    }, []);

    const handleBack = useCallback(() => {
        setState('');
        setCollectionName(null);
        // Clear query parameters when going back
        router.push('/create', undefined, { shallow: true });
    }, [router]);

    // Use first collection's logo for background
    const backgroundImage = collections.length > 0 && collections[0]?.logoImage 
        ? `https://s1.xrpnft.com/collection/${collections[0].logoImage}`
        : null;

    return (
        <CreateWrapper>
            <Toolbar id="back-to-top-anchor" />

            <BlackBackgroundWrapper />

            <Header />
            
            {/* Header Section matching collections.js style */}
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
                                Create
                            </Box>
                            <Box component="span" sx={{ 
                                fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                                color: 'text.secondary',
                                fontWeight: 300,
                                letterSpacing: '-0.01em',
                                opacity: 0.9
                            }}>
                                {state === '' ? 'Mint NFTs on the XRP Ledger' : 
                                 state === 'collection' ? 'Create a new collection' :
                                 state === 'nft' ? 'Mint a new NFT' : ''}
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ 
                flex: '1 0 auto', 
                py: { xs: 3, md: 6 },
                position: 'relative',
                zIndex: 1
            }}>
                {state === '' && (
                    <Container maxWidth="xl">
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, minmax(280px, 320px))' },
                            gap: 3
                        }}>
                        <CollectionCard
                            onCreate={() => setState('collection')}
                        />
                        <NFTCard
                            onCreate={handleNFTCreate}
                        />
                        <BulkCollectionsCard 
                            hasBulkCollections={hasBulkCollections} 
                        />
                        <MyCollectionsCard 
                            collections={collections} 
                        />
                    </Box>
                </Container>
                )}
                {state === 'collection' && (
                    <Container maxWidth="lg">
                        <CreateContainer>
                            <Box>
                                <BackButton onClick={handleBack} />
                                <CreateCollection
                                    showHeader={false}
                                    onCreate={() => handleBack()}
                                />
                            </Box>
                        </CreateContainer>
                    </Container>
                )}
                {state === 'nft' && (
                    <Container maxWidth="lg">
                        <CreateContainer>
                            <Box>
                                <BackButton onClick={handleBack} />
                                <Minting
                                    showHeader={false}
                                    defaultValues={{ collectionName }}
                                />
                            </Box>
                        </CreateContainer>
                    </Container>
                )}
            </Box>

            <ScrollToTop />

            <Footer />
        </CreateWrapper>
    );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
    const ogp = {
        canonical: 'https://xrpnft.com/create',
        title: 'Create NFTs & Collections | XRPNFT Marketplace',
        url: 'https://xrpnft.com/create',
        imgUrl: 'https://xrpnft.com/static/ogp.png',
        desc: "Create, mint, and manage NFT collections on XRPL's largest marketplace. Easy NFT creation with bulk minting options.",
        keywords: 'XRP NFT, create NFT, mint NFT, XRPL marketplace, NFT collection, bulk mint'
    };

    return {
        props: { ogp },
        revalidate: 3600, // Cache for 1 hour
    };
}