import { useState } from 'react';

// Material
import {
    Box,
    Tab
} from "@mui/material";

import {
    TabContext,
    TabList,
    TabPanel
} from "@mui/lab";

// Components
import NFTs from './NFTs';
import CollectionActivity from './CollectionActivity';

export default function ExploreNFT({ collection }) {

    const [value, setValue] = useState('tab-nfts');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="NFTs" value="tab-nfts" />
                            <Tab label="Activities" value="tab-activities" />
                        </TabList>
                    </Box>
                    <TabPanel value="tab-nfts" sx={{pl:0, pr:0}}>
                        <NFTs collection={collection} />
                    </TabPanel>
                    <TabPanel value="tab-activities" sx={{pl:0, pr:0}}>
                        {/* <Typography color='red'>Coming soon.</Typography> */}
                        <CollectionActivity collection={collection} />
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    );
};
