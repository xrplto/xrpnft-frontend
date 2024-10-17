import { useState, useEffect } from 'react';

// Material
import { Box, Paper, Stack, useTheme, useMediaQuery } from '@mui/material';

// Components
import CollectedCreatedNFTs from './CollectedCreatedNFTs';

export default function NFTs({ account, limit, collection, type }) {
    const [hasCreatedNFTs, setHasCreatedNFTs] = useState(true);
    const [createdNFTsLoaded, setCreatedNFTsLoaded] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        console.log('hasCreatedNFTs:', hasCreatedNFTs);
        console.log('createdNFTsLoaded:', createdNFTsLoaded);
    }, [hasCreatedNFTs, createdNFTsLoaded]);

    const paperStyle = {
        border: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        width: '100%'
    };

    const boxStyle = {
        mx: isMobile ? 0 : 2,
        my: 2
    };

    return (
        <Stack rowGap={2} width="100%">
            <Paper sx={paperStyle}>
                <Box sx={boxStyle}>
                    <CollectedCreatedNFTs
                        type="collected"
                        account={account}
                        limit={limit}
                        collection={collection}
                    />
                </Box>
            </Paper>

            <Paper sx={paperStyle}>
                <Box sx={boxStyle}>
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
