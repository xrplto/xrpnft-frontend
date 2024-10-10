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
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}22 25%, transparent 25%),
                                  linear-gradient(225deg, ${theme.palette.primary.main}22 25%, transparent 25%),
                                  linear-gradient(45deg, ${theme.palette.primary.main}22 25%, transparent 25%),
                                  linear-gradient(315deg, ${theme.palette.primary.main}22 25%, ${theme.palette.background.default} 25%)`,
                backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
                backgroundSize: '20px 20px',
                backgroundRepeat: 'repeat',
            }}
        >
            <Box flexGrow={1}>
                <Container maxWidth="lg">
                    <Stack
                        spacing={4}
                        direction={{ xs: 'column', md: 'row' }}
                        sx={{
                            px: { xs: 2, sm: 4 },
                            py: { xs: 4, sm: 6 },
                            justifyContent: 'center',
                            alignItems: 'stretch',
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