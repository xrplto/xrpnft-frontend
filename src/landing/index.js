// Material
import {
    styled,
    Button,
    Grid,
    Link,
    Stack,
    Typography
} from '@mui/material';

// Components
import CollectionPreview from './CollectionPreview';
// import SampleList from './SampleList';
import CollectionList from './CollectionList';

const AutoStack = styled(Stack)(
    ({ theme }) => `
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            align-items: start;
        }
    `
);

export default function Landing({collections}) {
    return (
        <Grid container spacing={3} justifyContent="center" alignItems="center" display="flex" sx={{mt:2}}>
            <Grid item xs={12} md={7} lg={7}>
                <AutoStack>
                    <Typography variant="h1a">Discover, collect and sell extraordinary NFTs</Typography>
                    <Stack sx={{mt:4}}>
                        <Typography variant="s1">XRPNFT is a fee-free platform for trading XRPL NFTs on the XRP Ledger, connecting creators and collectors in a <Typography variant="s1" color="#2de370">seamless NFT marketplace.</Typography></Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{mt: 3}}>
                        <Link
                            underline="none"
                            color="inherit"
                            href={`/collections`}
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
                </AutoStack>
            </Grid>

            <Grid item xs={12} md={5} lg={5} sx={{pl:0}} alignItems="center">
                <CollectionPreview collections={collections} />
            </Grid>

            <Grid item xs={12} md={12} lg={12} sx={{mt:10}} alignItems="center">
                <Stack alignItems="center" sx={{mt:1, mb:4}}>
                    <Typography variant='h2a'>Top Collections Today</Typography>
                </Stack>
                {/* <SampleList /> */}
                <CollectionList collections={collections} />
                <Stack alignItems="center" sx={{mt:1, mb:4}}>
                    <Link
                        underline="none"
                        color="inherit"
                        href={`/collections`}
                        rel="noreferrer noopener nofollow"
                    >
                        <Button variant="contained">See all collections</Button>
                    </Link>
                </Stack>
            </Grid>
        </Grid>
    )
};
