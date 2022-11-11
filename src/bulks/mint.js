import React from 'react';
import { useState, useEffect, useRef } from 'react';

// Material
import {
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';

// Components
import BulkMint1 from './BulkMint1';
import BulkMint2 from './BulkMint2';

export default function BulkMint({slug}) {
    const [choice, setChoice] = useState('fromfile');

    const handleChangeChoice = (event, newValue) => {
        setChoice(newValue);
    };

    return (
        <>
            <Stack spacing={2} sx={{mt: 4, mb:3}}>
                <Typography variant="h1a" >Bulk Mint Items </Typography>
                <Typography variant='p3'><Typography variant='s2'>*</Typography> Required fields</Typography>
                <Typography variant='s2'>Please read carefully each fields' description and before bulk mint your collection, download your final Metadata and check thoroughly again. Thanks!</Typography>
            </Stack>

            <Stack spacing={2} mb={4}>
                <Typography variant='p4'>Metadata <Typography variant='s2'>*</Typography></Typography>
                <Typography variant='p3'>You can load your metadata from file or create your own metadata.</Typography>

                <ToggleButtonGroup
                    color="primary"
                    value={choice}
                    exclusive
                    onChange={handleChangeChoice}
                >
                    <ToggleButton value="fromfile" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>From File</ToggleButton>
                    <ToggleButton value="createone" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Create One</ToggleButton>
                </ToggleButtonGroup>
            </Stack>

            {choice === "fromfile" &&
                <BulkMint1 slug={slug} />
            }

            {choice === "createone" &&
                <BulkMint2 slug={slug} />
            }
        </>
    );
}
