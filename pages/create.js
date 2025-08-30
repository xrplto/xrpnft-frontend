import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AppContext } from 'src/AppContext';

// Material
import { Box, Button, styled, Toolbar, Container, alpha } from '@mui/material';
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
        background: ${theme.palette.mode === 'dark' 
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[900]} 100%)`
            : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.paper} 100%)`};
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, ${theme.palette.primary.main}08 0%, transparent 70%);
            animation: pulse 15s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
        }
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
    const { accountProfile } = useContext(AppContext);
    
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

    return (
        <CreateWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />
            <CreateHeader state={state} />

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
                            gap: 3,
                            animation: 'fadeInUp 0.8s ease-out',
                            '@keyframes fadeInUp': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateY(30px)'
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                }
                            }
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
                            <Box sx={{
                                animation: 'slideIn 0.4s ease-out',
                                '@keyframes slideIn': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateX(20px)'
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateX(0)'
                                    }
                                }
                            }}>
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
                            <Box sx={{
                                animation: 'slideIn 0.4s ease-out',
                                '@keyframes slideIn': {
                                    from: {
                                        opacity: 0,
                                        transform: 'translateX(20px)'
                                    },
                                    to: {
                                        opacity: 1,
                                        transform: 'translateX(0)'
                                    }
                                }
                            }}>
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