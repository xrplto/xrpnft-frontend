import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AppBar, Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { TOP_BAR_HEIGHT_DESKTOP } from 'utils/constants';
import XAppBar from './AppBar';


const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

// const RootStyle = styled('div')({
//     display: 'flex',
//     minHeight: '100%',
//     overflow: 'hidden',
//     flexDirection: 'column'
// });

// const MainStyle = styled('div')(({ theme }) => ({
//     flexGrow: 1,
//     overflow: 'auto',
//     minHeight: '100%',
//     // paddingTop: TOP_BAR_HEIGHT_DESKTOP,
//     paddingBottom: theme.spacing(10)
// }));

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
    backgroundColor: theme.palette.background.paper,
    // backgroundColor: alpha(theme.palette.background.paper, 0.0),
    borderRadius: '0px',
    color: theme.palette.text.primary
    //backgroundColor: alpha("#00AB88", 0.7),
}));

// ----------------------------------------------------------------------

export default function MainLayout() {
    // const [open, setOpen] = useState(false);

    return (
        <Box>
            <StyledAppBar>
                {/* <Topbar /> */}
                {/* <Navbar onOpenSidebar={() => setOpen(true)} /> */}
                <Navbar />
            </StyledAppBar>
            <Offset />
            {/* <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} /> */}
            <Container  maxWidth={false}>
                <Outlet />
            </Container>
        </Box>
    );
}
