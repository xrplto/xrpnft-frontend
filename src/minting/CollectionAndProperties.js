import { useState } from 'react';

// Material
import {
    Stack,
    TextField,
    Typography,
} from '@mui/material';

// Components
import PropertySection from './NFTProperties/PropertySection';
import LevelsSection from './NFTLevels/LevelSection';

export default function CollectionAndProperties() {
    const [collectionName, setCollectionName] = useState('')
    const handleCollectionFieldChange = (e) => {
        setCollectionName(e.target.value)
    }

    return (
        <Stack spacing={2}>
            <Typography variant='p4' >Collection</Typography>
            <Typography variant='p3'>
                This is the collection where your item will appear.
            </Typography>
            <TextField required placeholder='Select collection' margin='dense'
                onChange={handleCollectionFieldChange}
                value={collectionName}
                sx={{
                    '&.MuiTextField-root': {
                        marginTop: 1
                    }
                }}
            />
            {/* <PropertySection />
            <LevelsSection /> */}
        </Stack>
    );
}
