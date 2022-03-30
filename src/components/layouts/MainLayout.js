import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';
//
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;
const APP_BAR = 52;

const RootStyle = styled('div')({
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: APP_BAR + 50,
    paddingBottom: theme.spacing(10)
}));

export const AppBarStyle = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
    // backgroundColor: alpha(theme.palette.background.paper, 0.0),
    borderRadius: '0px',
    color: theme.palette.text.primary
    //backgroundColor: alpha("#00AB88", 0.7),
}));

// ----------------------------------------------------------------------

export default function MainLayout() {
    const [open, setOpen] = useState(false);

    return (
        <RootStyle>
            <AppBarStyle>
                {/* <Topbar /> */}
                <Navbar onOpenSidebar={() => setOpen(true)}/>
            </AppBarStyle>
            <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
            <MainStyle>
                <Outlet />
            </MainStyle>
        </RootStyle>
    );
}
