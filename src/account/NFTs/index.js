import { useState } from 'react';

// Material
import { Box, Button, Paper, Stack } from '@mui/material';

// Components
import CollectedCreatedNFTs from './CollectedCreatedNFTs';

export default function NFTs({ account, limit, collection, type }) {
    const [openCollected, setOpenCollected] = useState(false);
    const [openCreated, setOpenCreated] = useState(false);

    const handleClickCollected = () => {
        setOpenCollected((state) => !state);
    };

    const handleClickCreated = () => {
        setOpenCreated((state) => !state);
    };

    return (
        <Stack rowGap={2}>
            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickCollected}>
                    Collected NFTs
                </Button>
                <Box m={2} sx={{ display: openCollected || type === 'collected'  ? 'block' : 'none' }}>
                    <CollectedCreatedNFTs type="collected" account={account} limit={limit} collection={collection} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickCreated}>
                    Created NFTs
                </Button>
                <Box m={2} sx={{ display: openCreated || type === 'created' ? 'block' : 'none' }}>
                    <CollectedCreatedNFTs type="created" account={account} limit={limit} collection={collection} />
                </Box>
            </Paper>
        </Stack>
    );
}
