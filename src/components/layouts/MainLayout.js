import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Container } from '@mui/material';
import Navbar from './Navbar';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
    backgroundColor: theme.palette.background.paper,
    borderRadius: '0px',
    color: theme.palette.text.primary
}));

// ----------------------------------------------------------------------

export default function MainLayout() {
    return (
        <Box>
            <StyledAppBar>
                <Navbar />
            </StyledAppBar>
            <Offset />
            <Container maxWidth={false}>
                <Outlet />
            </Container>
        </Box>
    );
}
