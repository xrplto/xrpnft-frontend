import { Box, Container, Stack, useTheme } from '@mui/material';
import NFTCard from './NFTCard';
import CollectionCard from './CollectionCard';
import BulkCollectionsCard from './BulkCollectionsCard';
import MyCollectionsCard from './MyCollectionsCard';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from 'src/AppContext';
import axios from 'axios';

export default function CreateContainer() {
    const theme = useTheme();
    const { accountProfile } = useContext(AppContext);
    const [collections, setCollections] = useState([]);
    const [hasBulkCollections, setHasBulkCollections] = useState(false);

    useEffect(() => {
        if (accountProfile?.account && accountProfile?.token) {
            const BASE_URL = 'https://api.xrpnft.com/api';
            axios
                .get(`${BASE_URL}/collection/query?account=${accountProfile.account}`, {
                    headers: { 'x-access-token': accountProfile.token }
                })
                .then((res) => {
                    if (res.status === 200 && res.data) {
                        setCollections(res.data.collections);
                        const hasBulkTypes = res.data.collections.some(collection => 
                            ["bulk", "random", "sequence"].includes(collection.type)
                        );
                        setHasBulkCollections(hasBulkTypes);
                    }
                })
                .catch((err) => {
                    console.log('err->>', err);
                });
        }
    }, [accountProfile]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}22 25%, transparent 25%),
                                  linear-gradient(225deg, ${theme.palette.primary.main}22 25%, transparent 25%),
                                  linear-gradient(45deg, ${theme.palette.primary.main}22 25%, transparent 25%),
                                  linear-gradient(315deg, ${theme.palette.primary.main}22 25%, ${theme.palette.background.default} 25%)`,
                backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat',
            }}
        >
            <Box flexGrow={1}>
                <Container maxWidth="lg">
                    <Stack
                        spacing={4}
                        direction={{ xs: 'column', md: 'row' }}
                        sx={{
                            px: { xs: 2, sm: 4 },
                            py: { xs: 4, sm: 6 },
                            justifyContent: 'center',
                            alignItems: 'stretch',
                        }}
                    >
                        <CollectionCard onCreate={() => {/* handle collection creation */}} />
                        <NFTCard onCreate={() => {/* handle NFT creation */}} />
                        <BulkCollectionsCard hasBulkCollections={hasBulkCollections} />
                        <MyCollectionsCard collections={collections} />
                    </Stack>
                </Container>
            </Box>
            {/* Footer component should be placed here */}
        </Box>
    );
}