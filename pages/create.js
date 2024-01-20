import { useState } from 'react';
import axios from 'axios';

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
                            onCreate={(collectionName) => {
                                setCollectionName(collectionName);
                                setState('nft');
                            }}
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
