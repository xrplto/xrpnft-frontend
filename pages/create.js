import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from 'src/AppContext';

// Material
import { Box, Button, styled, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
        // overflow: hidden;
        flex: 1;
`
);

const BackButton = ({ onClick }) => (
    <Button size="small" variant="contained" onClick={onClick}>
        <ChevronLeftIcon />
        Back
    </Button>
);

export default function Create() {
    const [state, setState] = useState('');
    const [collectionName, setCollectionName] = useState(null);
    const [collections, setCollections] = useState([]);
    const [hasBulkCollections, setHasBulkCollections] = useState(false);
    const { accountProfile } = useContext(AppContext);
    
    console.log('Create component rendered, current state:', state, 'collectionName:', collectionName);
    
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
    }, []);

    return (
        <CreateWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />
            <CreateHeader state={state} />

            <CreateContainer>
                {state === '' && (
                    <>
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
                    </>
                )}
                {state === 'collection' && (
                    <Box>
                        <BackButton onClick={handleBack} />
                        <CreateCollection
                            showHeader={false}
                            onCreate={() => handleBack()}
                        />
                    </Box>
                )}
                {state === 'nft' && (
                    <Box>
                        <BackButton onClick={handleBack} />
                        <Minting
                            showHeader={false}
                            defaultValues={{ collectionName }}
                        />
                    </Box>
                )}
            </CreateContainer>

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