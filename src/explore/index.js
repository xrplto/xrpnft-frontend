import axios from 'axios';
import { useContext, useState } from 'react';

// Material
import {
    Box,
    Button,
    Tab,
    Typography,
    useTheme,
    useMediaQuery
} from "@mui/material";

import {
    TabContext,
    TabList,
    TabPanel
} from "@mui/lab";

// Components
import NFTs from './NFTs';
import CollectionActivity from './CollectionActivity';
import { AppContext } from 'src/AppContext';

export default function ExploreNFT({ collection }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { deletingNfts, accountProfile } = useContext(AppContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const isAdmin = accountProfile?.admin;

    const [value, setValue] = useState('tab-nfts');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleRemoveAll = () => {
        if (deletingNfts.length === 0 || !isAdmin) return;

        const nftNames = deletingNfts
            ?.map(
                (nft) =>
                    `"${nft.meta?.name}"` ||
                    `"${nft.meta?.Name}"` ||
                    `"No Name"`
            )
            ?.join(', ');
        const idsToDelete = deletingNfts?.map((nft) => nft._id);

        if (!confirm(`You're about to delete the following NFTs ${nftNames}?`))
            return;

        axios
            .delete(`${BASE_URL}/nfts`, {
                data: {
                    issuer: collection?.account,
                    taxon: collection?.taxon,
                    cid: collection?.uuid,
                    idsToDelete
                }
            })
            .then((res) => {
                location.reload();
            })
            .catch((err) => {
                console.log('Error on removing nfts!', err);
            });
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    mb: 2
                }}>
                    <TabList 
                        onChange={handleChange} 
                        aria-label="explore tabs"
                        variant={isMobile ? "fullWidth" : "standard"}
                    >
                        <Tab label="NFTs" value="tab-nfts" />
                        <Tab label="Activities" value="tab-activities" />
                    </TabList>
                    
                    {isAdmin && (
                        <Button
                            variant='contained'
                            color='error'
                            sx={{ 
                                mt: isMobile ? 2 : 0,
                                py: 1,
                                px: 2,
                                minWidth: 120
                            }}
                            onClick={handleRemoveAll}
                            disabled={deletingNfts.length === 0}
                        >
                            Delete All
                        </Button>
                    )}
                </Box>
                <TabPanel value="tab-nfts" sx={{p: 0}}>
                    <NFTs collection={collection} />
                </TabPanel>
                <TabPanel value="tab-activities" sx={{p: 0}}>
                    <CollectionActivity collection={collection} />
                </TabPanel>
            </TabContext>
        </Box>
    );
}
