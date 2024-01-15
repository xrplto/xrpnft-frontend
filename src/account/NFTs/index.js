import { useState } from 'react';

// Material
import { Box, Button, Paper, Stack } from '@mui/material';

// Components
import CollectedNFTs from './CollectedNFTs';
import CreatedNFTs from './CreatedNFTs';

export default function NFTs({ account }) {
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
                <Box m={2} sx={{ display: openCollected ? 'block' : 'none' }}>
                    <CollectedNFTs account={account} />
                </Box>
            </Paper>

            <Paper sx={{ border: 'none' }}>
                <Button fullWidth onClick={handleClickCreated}>
                    Created NFTs
                </Button>
                <Box m={2} sx={{ display: openCreated ? 'block' : 'none' }}>
                    <CreatedNFTs account={account} />
                </Box>
            </Paper>
        </Stack>
    );
}
