// Material
import {
    styled,
    Button,
    Grid,
    Link,
    Stack,
    Typography,
    Container,
    Box
} from '@mui/material';

// Components
import CollectionPreview from './CollectionPreview';
import CollectionList from './CollectionList';

const AutoStack = styled(Stack)(
    ({ theme }) => `
        align-items: center;
        @media (min-width: ${theme.breakpoints.values.md}px) {
            align-items: flex-start;
        }
    `
);

const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const HeroButton = styled(Button)(
    ({ theme }) => `
        padding: 12px 24px;
        font-weight: 600;
        text-transform: none;
        border-radius: 30px;
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
    `
);

export default function Landing({collections}) {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={6} justifyContent="center" alignItems="center" sx={{mt: 8, mb: 12}}>
                <Grid item xs={12} md={6}>
                    <AutoStack spacing={4}>
                        <GradientTypography variant="h1" fontWeight="bold">
                            XRP NFT Marketplace
                        </GradientTypography>
                        <Typography variant="h4" color="text.secondary">
                            Trade XRP NFTs <Box component="span" color="primary.main" fontWeight="bold">Without Barriers.</Box>
                        </Typography>

                        <Stack direction="row" spacing={3} sx={{mt: 4}}>
                            <Link
                                underline="none"
                                color="inherit"
                                href={`/collections`}
                                rel="noreferrer noopener nofollow"
                            >
                                <HeroButton variant="contained" color="primary">
                                    Explore Collections
                                </HeroButton>
                            </Link>

                            <Link
                                underline="none"
                                color="inherit"
                                href={`/create`}
                                rel="noreferrer noopener nofollow"
                            >
                                <HeroButton variant="outlined" color="primary">
                                    Create NFT
                                </HeroButton>
                            </Link>
                        </Stack>
                    </AutoStack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -20,
                            left: -20,
                            right: 20,
                            bottom: 20,
                            background: 'linear-gradient(45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
                            borderRadius: '16px',
                            zIndex: -1,
                        }
                    }}>
                        <CollectionPreview collections={collections.length>0?[collections[0]]:[]} />
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{mt: 16, mb: 8}}>
                <Typography variant='h2' textAlign="center" fontWeight="bold" mb={6}>
                    Top Collections
                </Typography>
                <CollectionList collections={collections} />
            </Box>
        </Container>
    )
};
