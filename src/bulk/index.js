import React from 'react';

// Material
import {
    Stack,
    Typography
} from '@mui/material';

// Components
import BulkList from './BulkList';

export default function Bulks() {
    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a">Manage Bulks</Typography>
                <Typography variant="d1">Prepare to mint bulk NFTs, get zip files from google drive, extract and pin to IPFS.</Typography>
            </Stack>
            <Stack sx={{mt:5, minHeight: '50vh'}}>
                <BulkList />
            </Stack>
        </>
    );
}
