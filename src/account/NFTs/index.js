import { useState, useEffect } from 'react';

// Material
import { Box, Paper, Stack } from '@mui/material';

// Components
import CollectedCreatedNFTs from './CollectedCreatedNFTs';

export default function NFTs({ account, limit, collection, type }) {
    const [hasCreatedNFTs, setHasCreatedNFTs] = useState(true); // Start with true to always show initially
    const [createdNFTsLoaded, setCreatedNFTsLoaded] = useState(false);

    useEffect(() => {
        console.log('hasCreatedNFTs:', hasCreatedNFTs);
        console.log('createdNFTsLoaded:', createdNFTsLoaded);
    }, [hasCreatedNFTs, createdNFTsLoaded]);

    return (
        <Stack rowGap={2}>
            <Paper sx={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Box m={2}>
                    <CollectedCreatedNFTs
                        type="collected"
                        account={account}
                        limit={limit}
                        collection={collection}
                    />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Box m={2}>
                    <CollectedCreatedNFTs
                        type="created"
                        account={account}
                        limit={limit}
                        collection={collection}
                        setHasCreatedNFTs={setHasCreatedNFTs}
                        setCreatedNFTsLoaded={setCreatedNFTsLoaded}
                    />
                </Box>
            </Paper>
        </Stack>
    );
}
