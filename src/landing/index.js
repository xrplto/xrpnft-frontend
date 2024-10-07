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

export default function Landing({ collections }) {
    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: { xs: 4, md: 8 }, mb: { xs: 6, md: 12 } }}
            >
                <Grid item xs={12} md={6}>
                    <AutoStack spacing={3}>
                        <GradientTypography
                            variant="h2"
                            fontWeight="bold"
                            sx={{
                                fontSize: {
                                    xs: '2rem',
                                    sm: '2.5rem',
                                    md: '3rem'
                                }
                            }}
                        >
                            XRP NFT Marketplace
                        </GradientTypography>
                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{
                                fontSize: {
                                    xs: '1.25rem',
                                    sm: '1.5rem',
                                    md: '1.75rem'
                                }
                            }}
                        >
                            Trade XRP NFTs{' '}
                            <Box
                                component="span"
                                color="primary.main"
                                fontWeight="bold"
                            >
                                Without Barriers.
                            </Box>
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            sx={{ mt: 3, width: '100%' }}
                        >
                            <Link
                                underline="none"
                                color="inherit"
                                href={`/collections`}
                                rel="noreferrer noopener nofollow"
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                <HeroButton
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Explore Collections
                                </HeroButton>
                            </Link>

                            <Link
                                underline="none"
                                color="inherit"
                                href={`/create`}
                                rel="noreferrer noopener nofollow"
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                <HeroButton
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                >
                                    Create NFT
                                </HeroButton>
                            </Link>
                        </Stack>
                    </AutoStack>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -10,
                                left: -10,
                                right: 10,
                                bottom: 10,
                                background:
                                    'linear-gradient(45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
                                borderRadius: '16px',
                                zIndex: -1
                            }
                        }}
                    >
                        <CollectionPreview
                            collections={
                                collections.length > 0 ? [collections[0]] : []
                            }
                        />
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ mt: { xs: 8, md: 16 }, mb: { xs: 4, md: 8 } }}>
                <CollectionList collections={collections} />
            </Box>

            <Box sx={{ height: { xs: 60, md: 120 } }} />
        </Container>
    );
}
