//import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
//import homeFill from '@iconify/icons-eva/home-fill';
//import personFill from '@iconify/icons-eva/person-fill';
//import settings2Fill from '@iconify/icons-eva/settings-2-fill';
//import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Box, Typography, Button, MenuItem, Avatar, IconButton, Stack } from '@mui/material';
// components
import MenuPopover from '../components/MenuPopover';
import LoginDialog from '../components/LoginDialog';
//
import { useContext } from 'react'
import Context from '../Context'

import profile from '../_mocks_/profile';
import axios from 'axios';
// ----------------------------------------------------------------------
const SERVER_BASE_URL = 'http://127.0.0.1:81/api/xumm';
// ----------------------------------------------------------------------
export default function AccountPopover() {
    const { accountProfile, setAccountProfile, setLoading } = useContext(Context);
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    
    const onConnectXumm = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${SERVER_BASE_URL}/login`);
            if (res.status === 200) {
                //setLog(res.data.status ? "connect success" : "connect failed");
                setAccountProfile({payload: res.data, socketUrl: res.data.data.wsUrl, account: null});
                setOpenLogin(true);
            }
        } catch (err) {
            alert(err);
        }
        setLoading(false);
    };

    const onDisconnectXumm = async () => {
        setLoading(true);
        try {
            const res = await axios.delete(`${SERVER_BASE_URL}/logout/${accountProfile.payload.data.uuid}`);
            if (res.status === 200) {
                //setLog(res.data.status ? "disconnect success" : "disconnect failed");
                setAccountProfile({payload: null, socketUrl: null, account: null});
            }
        } catch(err) {
        }
        setLoading(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleLogin = () => {
        setOpen(false);
        onConnectXumm();
    };

    const handleLoginClose = () => {
        onDisconnectXumm();
        setOpenLogin(false);
    };

    const handleSetAccount = (account) => {
        setOpenLogin(false);
        let profile = {payload: accountProfile.payload, socketUrl: accountProfile.socketUrl, account: account}
        setAccountProfile(profile);
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(open && {
                        '&:before': {
                            zIndex: 1,
                            content: "''",
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            position: 'absolute',
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
                        }
                    })
                }}
            >
                <Avatar src={profile.photoURL} alt="photoURL" />
            </IconButton>

            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{ width: 220 }}
            >

                {accountProfile && accountProfile.account ? (
                        <>
                        <Box sx={{ my: 1.5, px: 2.5 }}>
                            <Typography variant="subtitle1" noWrap>
                                Logged In
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                {accountProfile.account}
                            </Typography>
                        </Box>
                        <Box sx={{ p: 2, pt: 1.5 }}>
                        <Button fullWidth color="inherit" variant="outlined">
                            Logout
                        </Button>
                        </Box>
                        </>
                    ) : (
                        <MenuItem
                            key="xumm"
                            onClick={handleLogin}
                            sx={{ typography: 'body2', py: 1, px: 2.5 }}
                        >
                            <Stack direction='row' spacing={1} sx={{mr: 2}} alignItems='center'>
                                <Avatar alt="xumm" src="/static/xumm.jpg"/>
                                <h3 style={{marginLeft: '10px'}}>XUMM</h3>
                            </Stack>
                        </MenuItem>
                )}

            {/* <Divider sx={{ my: 1 }} /> */}
            </MenuPopover>

            <LoginDialog
                open={openLogin}
                handleClose={handleLoginClose}
                handleSetAccount={handleSetAccount}
            />
        </>
    );
}
