import { useState, useEffect, useContext } from 'react';
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
    
    // Define the callback function separately to ensure proper reference
    const handleNFTCreate = (selectedCollectionName) => {
        console.log('=== CREATE.JS handleNFTCreate CALLBACK ===');
        console.log('Received collection name:', selectedCollectionName);
        console.log('Current state before update:', state);
        console.log('Current collectionName before update:', collectionName);
        
        try {
            console.log('Setting collectionName to:', selectedCollectionName);
            setCollectionName(selectedCollectionName);
            
            console.log('Setting state to: nft');
            setState('nft');
            
            console.log('Both state updates called successfully');
            
        } catch (error) {
            console.error('Error in handleNFTCreate:', error);
            console.error('Stack:', error.stack);
        }
        console.log('=== END CREATE.JS handleNFTCreate CALLBACK ===');
    };

    const handleBack = () => {
        setState('');
    };

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
    let ret = {};

    const ogp = {};
    ogp.canonical = 'https://xrpnft.com/create';
    ogp.title = 'Create';
    ogp.url = 'https://xrpnft.com/create';
    ogp.imgUrl = 'https://xrpnft.com/static/ogp.png';
    ogp.desc =
        "XRPL's largest NFT marketplace: Buy, sell, mint with ease. Experience exclusive NFT creation and trade.";

    ret = { ogp };

    return {
        props: ret // will be passed to the page component as props
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        // revalidate: 10, // In seconds
    };
}