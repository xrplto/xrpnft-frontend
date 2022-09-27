import React from 'react';

// Material
import {
    Stack,
    Typography
} from '@mui/material';

// Components
import CollectionList from './CollectionList';

export default function Collections() {
    return (
        <>
            <Stack spacing={1} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a">Explore collections</Typography>
            </Stack>
            
            <Stack sx={{mt:5, minHeight: '50vh'}}>
                <CollectionList isAll={true}/>
            </Stack>
        </>
    );
}
