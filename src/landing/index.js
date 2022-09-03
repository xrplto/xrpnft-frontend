// Material
import {
    alpha, styled, useTheme, useMediaQuery,
    Box,
    Button,
    Grid,
    IconButton,
    Link,
    Stack,
    Toolbar,
    Typography
} from '@mui/material';

import CollectionPreview from './CollectionPreview';
import SampleCardList from './SampleCardList';

const AutoStack1 = styled(Stack)(
    ({ theme }) => `
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            align-items: start;
        }
  `
);

export default function Landing({data}) {
    const theme = useTheme();
    const isScreenMD = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Grid container spacing={3} justifyContent="center" alignItems="center" display="flex" sx={{mt:2}}>
            <Grid item xs={12} md={7} lg={7}>
                <AutoStack1>
                    <Typography variant="h1a">Discover, collect, and sell extraordinary NFTs</Typography>
                    <Stack sx={{mt:4}}>
                        <Typography variant="s1">XRPNFT.COM is the world's first and largest XRPL NFT Marketplace.</Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{mt: 3}}>
                        <Link
                            underline="none"
                            color="inherit"
                            href={`/explore-collections`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Button variant="contained">Explore</Button>
                        </Link>

                        <Link
                            underline="none"
                            color="inherit"
                            href={`/create`}
                            rel="noreferrer noopener nofollow"
                        >
                            <Button variant="outlined">Create</Button>
                        </Link>
                    </Stack>
                </AutoStack1>
            </Grid>

            <Grid item xs={12} md={5} lg={5} sx={{pl:0}} alignItems="center">
                <CollectionPreview />
            </Grid>

            <Grid item xs={12} md={12} lg={12} sx={{mt:10}} alignItems="center">
                <Stack alignItems="center" sx={{mt:1, mb:4}}>
                    <Typography variant='h2a'>Hot NFTs</Typography>
                </Stack>
                <SampleCardList />
            </Grid>
        </Grid>
    )
};
