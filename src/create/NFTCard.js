// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Material
import { Card, Stack, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

export default function NFTCard({ collection, onCreate }) {
    const { openSnackbar } = useContext(AppContext);

    const handleCreate = () => {
        if (!collection) {
            openSnackbar(
                'You must first create a collection for NFTs.',
                'error'
            );
            return;
        }
        onCreate();
    };

    return (
        <Card
            sx={{
                flex: 1,
                px: 4,
                py: 6,
                cursor: 'pointer'
            }}
            onClick={handleCreate}
        >
            <Stack
                sx={{
                    height: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <UploadIcon sx={{ fontSize: 72, mb: 1 }} />
                <Typography variant="p2">Create a single NFT</Typography>
            </Stack>
        </Card>
    );
}
