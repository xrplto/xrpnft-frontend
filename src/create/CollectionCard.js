// Material
import { Card, Stack, Typography } from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

export default function CollectionCard({ onCreate }) {
    return (
        <Card
            sx={{
                px: 4,
                width: 1,
                height: '200px'
            }}
            onClick={onCreate}
        >
            <Stack
                sx={{
                    height: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    height: '200px'
                }}
            >
                <LibraryAddIcon sx={{ fontSize: 72, mb: 1 }} />
                <Typography variant="p2">Create a new collection</Typography>
            </Stack>
        </Card>
    );
}