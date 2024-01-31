// Material
import { Box, Container, Stack, useTheme } from '@mui/material';

export default function CreateContainer({ children }) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor:
                    theme.palette.grey[
                        theme.palette.mode === 'light' ? 200 : 800
                    ]
            }}
        >
            <Container maxWidth="md">
                <Stack
                    spacing={2}
                    direction={{ xs: 'column', sm: 'row' }}
                    sx={{
                        px: 1,
                        py: 6,
                        justifyContent: 'center'
                    }}
                >
                    {children}
                </Stack>
            </Container>
        </Box>
    );
}