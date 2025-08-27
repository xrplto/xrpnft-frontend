import { Box, Container, Stack, useTheme } from '@mui/material';

export default function CreateContainer({ children }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}22 0%, transparent 50%), 
                                  radial-gradient(circle at 100% 0%, ${theme.palette.secondary.main}22 0%, transparent 50%)`,
                backgroundSize: '100% 100%, 50% 50%',
                backgroundPosition: 'center center, top right',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Box flexGrow={1}>
                <Container maxWidth="lg">
                    <Stack
                        spacing={3}
                        direction={{ xs: 'column', lg: 'row' }}
                        sx={{
                            px: { xs: 2, sm: 3 },
                            py: { xs: 4, sm: 6 },
                            justifyContent: 'center',
                            alignItems: 'stretch',
                            flexWrap: 'wrap',
                            '& > *': {
                                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(25% - 12px)' },
                                minWidth: { xs: '100%', sm: 'calc(50% - 12px)', lg: '280px' },
                                maxWidth: { xs: '100%', sm: '100%', lg: '400px' },
                            },
                        }}
                    >
                        {children}
                    </Stack>
                </Container>
            </Box>
            {/* Footer component should be placed here */}
        </Box>
    );
}
