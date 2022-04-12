import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
// import MuiAppBar from '@mui/material/AppBar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NFTList } from 'components/nftList/NFTList';
// import { AppBar } from 'components/layouts/MainLayout';
import FilterList from 'components/nftList/FilterList';
import { resetFlags } from 'app/slices/filterSlice';
import { useDispatch } from 'react-redux'
import { resetNFTs } from 'app/slices/nftsSlice'


const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NFTMarketplace() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // TODO: reset filter, nfts redux states
    dispatch(resetFlags())
    dispatch(resetNFTs())
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* <Filter /> */}
      <AppBar position="fixed" open={open} sx={!open ? { top: 'auto', width: 'auto', height: '100%', right: 'auto' } : { display: 'none' }} >
        <Toolbar sx={open ? {} : { '&.MuiToolbar-root': { padding: 0 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }), margin: 0 }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: 'auto',
            boxShadow: 'none',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
            backgroundColor: `${theme.palette.background.paper}00`,
            borderRadius: '0px',
            color: theme.palette.text.primary
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader sx={{ justifyContent: 'space-between', paddingLeft: '1vw' }}>
          <Typography variant="h6" noWrap component="div">
            Filter
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <FilterList />
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <NFTList />
      </Main>
    </Box>
  );
}
