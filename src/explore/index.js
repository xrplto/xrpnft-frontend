import { useState } from 'react';

// Material
import {
    Box, Tab, Typography
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import NFTs from './NFTs';


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
                    <TabPanel sx={{ px: 0 }} value="tab-nfts">
                        <NFTs collection={collection} />
                    </TabPanel>
                    <TabPanel value="tab-activities">
                        <Typography color='red'>Coming soon.</Typography>
                    </TabPanel>
                </TabContext>
            </Box>


        </>
    );
};
