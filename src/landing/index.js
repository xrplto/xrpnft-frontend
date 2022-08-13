// Material
import {
    Box,
    Button,
    Grid,
    IconButton,
    Link,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';

import { hotDropsData } from "./MockupData";
import CollectionPreview from './CollectionPreview';
import CardList from './CardList';

export default function Landing({data}) {
    return (
        <Grid container spacing={3} justifyContent="center" alignItems="center" display="flex">
            <Grid item xs={12} md={7} lg={7}>
                <Typography variant="h1a">Discover, collect, and sell extraordinary NFTs</Typography>
                <Stack sx={{mt:3}}>
                    <Typography variant="s1">XRPNFT.COM is the world's first and largest XRPL NFT Marketplace.</Typography>
                </Stack>

                <Stack direction="row" spacing={2} sx={{mt: 4}}>
                    <Button variant="contained">Explore</Button>
                    <Button variant="outlined">Create</Button>
                </Stack>
            </Grid>
            <Grid item xs={12} md={5} lg={5} sx={{pl:0}} alignItems="center">
                {/* <Card child={<CollectionPreview /> } width="500px" height="500px">
                    
                </Card> */}
                <CollectionPreview />
            </Grid>

            <Grid item xs={12} md={12} lg={12} sx={{mt:10}} alignItems="center">
                <Stack alignItems="center" sx={{mt:1, mb:4}}>
                    <Typography variant='h2'>Hot NFTs</Typography>
                </Stack>
                <CardList list={hotDropsData} />
            </Grid>
        </Grid>
    )
};
