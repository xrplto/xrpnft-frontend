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
    Typography,
    CircularProgress,
    Chip
} from '@mui/material';

import {
    Close as CloseIcon,
    OpenInNew as OpenInNewIcon
} from '@mui/icons-material';

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
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderRadius: '4px',
    padding: '0.5em 1em',
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
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

export default function QRDialogNoPush({open, type, qrUrl, nextUrl, onClose}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (qrUrl) {
            const img = new Image();
            img.onload = () => setIsLoading(false);
            img.src = qrUrl;
        }
    }, [qrUrl]);

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
                    <Chip label={type} color="primary" variant="outlined" />
                    <Typography variant='subtitle1' textAlign="center">
                        Sign the transaction on your XUMM App
                    </Typography>
                    
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Box
                            component="img"
                            alt="QR"
                            src={qrUrl}
                            sx={{
                                width: '100%',
                                maxWidth: 250,
                                height: 'auto',
                                borderRadius: 2,
                                boxShadow: 3
                            }}
                        />
                    )}
                    
                    <Link
                        underline="none"
                        color="inherit"
                        target="_blank"
                        href={nextUrl}
                        rel="noreferrer noopener nofollow"
                    >
                        <LinkTypography variant="subtitle2" color='primary'>
                            Open in XUMM
                            <OpenInNewIcon fontSize="small" />
                        </LinkTypography>
                    </Link>
                </Stack>
            </DialogContent>
        </ExDialog>
    );
}
