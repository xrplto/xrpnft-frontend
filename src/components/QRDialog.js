import { useState, useEffect } from 'react';

// Material
import {
    alpha, styled, useTheme, useMediaQuery,
    Box,
    Dialog,
    Divider,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Link,
    Stack,
    Typography
} from '@mui/material';

import {
    Close as CloseIcon
} from '@mui/icons-material';

import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const ExDialog = styled(Dialog) (({ theme }) => ({
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)', // Fix on Mobile
    backgroundColor: alpha(theme.palette.background.paper, 0.0),
    borderRadius: '0px',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const LinkTypography = styled(Typography)(({ theme }) => ({
    // backgroundColor: alpha(theme.palette.background.paper, 0.0),
    borderRadius: '2px',
    border: '0px solid #00AB88',
    padding: '0.5em',
    // backgroundColor: alpha("#00AB88", 0.99),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    padding: '10px 20px',
    fontWeight: 'bold',
    textTransform: 'none',
}));

const ExDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

export default function QRDialog({open, type, qrUrl, nextUrl, onClose}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [showQR, setShowQR] = useState(false);
    const [qrLoaded, setQrLoaded] = useState(false);

    useEffect(() => {
        setShowQR(false);
        setQrLoaded(false);
    }, [open]);

    return (
        <ExDialog
            fullScreen={fullScreen}
            fullWidth={true}
            maxWidth='xs'
            onClose={onClose}
            open={open}
            sx={{ zIndex: 1303 }}
        >
            <ExDialogTitle textAlign="center" onClose={onClose}>
                Sign Transaction
            </ExDialogTitle>

            <DialogContent dividers>
                <Stack alignItems='center' spacing={3}>
                    <Typography variant='h6'>{type}</Typography>
                    <Typography variant='body1' align="center">
                        Sign the transaction on your XUMM App
                    </Typography>
                    <Link
                        component="button"
                        underline="hover"
                        variant="body2"
                        color="primary"
                        onClick={() => {
                            setShowQR(true);
                        }}
                    >
                        <Typography variant='body2' color='primary'>
                            Didn't receive a notification? Click here to scan QR!
                        </Typography>
                    </Link>
                </Stack>
                {showQR && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            mt: 4,
                            mb: 2,
                        }}
                    >
                        <Box position="relative" mb={3}>
                            {!qrLoaded && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                            <Box
                                component="img"
                                alt="QR"
                                src={qrUrl}
                                sx={{
                                    width: '100%',
                                    maxWidth: 250,
                                    height: 'auto',
                                    display: qrLoaded ? 'block' : 'none',
                                }}
                                onLoad={() => setQrLoaded(true)}
                            />
                        </Box>
                        
                        <StyledButton
                            variant="contained"
                            color="primary"
                            href={nextUrl}
                            target="_blank"
                            rel="noreferrer noopener nofollow"
                        >
                            Open in XUMM
                        </StyledButton>
                    </Box>
                )}
            </DialogContent>
        </ExDialog>
    );
}
