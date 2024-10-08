import React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';

// Components
import SpinNFT from './SpinNFT';
import ViewNFT from './ViewNFT';

export default function Collection({ data }) {
    const [view, setView] = useState(data?.collection?.type);

    const extra = data?.collection?.extra;
    const pendingNfts = extra ? extra.pendingNfts : 0;

    return (
        <Box>
            {(view === 'random' || view === 'sequence') && pendingNfts > 0 ? (
                <SpinNFT collection={data.collection} setView={setView} />
            ) : (
                <ViewNFT collection={data.collection} />
            )}
        </Box>
    );
}
