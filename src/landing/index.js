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

// Add this new import
import { useTheme } from '@mui/material/styles';

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
        font-size: 1rem;
        text-transform: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        &.MuiButton-contained {
            background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
            color: ${theme.palette.common.white};
            border: none;

            &:hover {
                background: linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark});
            }
        }

        &.MuiButton-outlined {
            border: 2px solid ${theme.palette.primary.main};
            color: ${theme.palette.primary.main};

            &:hover {
                background: rgba(${theme.palette.primary.main}, 0.05);
            }
        }
    `
);

export default function Landing({ collections }) {
    const theme = useTheme();

    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={6}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: { xs: 4, md: 10 }, mb: { xs: 6, md: 14 } }}
            >
                <Grid item xs={12} lg={6}>
                    <AutoStack spacing={4} sx={{ maxWidth: { md: '55%', lg: '45%' }, mx: 'auto' }}>
                        <GradientTypography
                            variant="h1"
                            fontWeight="bold"
                            sx={{
                                fontSize: {
                                    xs: '2.5rem',
                                    sm: '3rem',
                                    md: '3.5rem',
                                    lg: '4rem'
                                },
                                textAlign: { xs: 'center', md: 'left' }
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
                                },
                                textAlign: { xs: 'center', md: 'left' }
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
                            spacing={3}
                            sx={{ mt: 4, width: '100%' }}
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
                                    fullWidth
                                >
                                    Create NFT
                                </HeroButton>
                            </Link>
                        </Stack>
                    </AutoStack>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Box
                        sx={{
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -15,
                                left: -15,
                                right: 15,
                                bottom: 15,
                                background:
                                    'linear-gradient(45deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 100%)',
                                borderRadius: '20px',
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

            <Box sx={{ mt: { xs: 10, md: 20 }, mb: { xs: 5, md: 10 } }}>
                <CollectionList collections={collections} />
            </Box>

            <Box sx={{ height: { xs: 80, md: 160 } }} />
        </Container>
    );
}
