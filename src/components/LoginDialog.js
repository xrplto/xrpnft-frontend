import {
    styled,
    Box,
    Dialog,
    Link,
    Typography,
    DialogContent,
    IconButton,
    useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@mui/system';

// Define animation keyframes
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const QRDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: 16,
        padding: theme.spacing(2),
        maxWidth: '400px',
        width: '90%',
        background: theme.palette.background.paper,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    },
}));

const StyledDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px !important',
    gap: '24px',
});

const QRContainer = styled(Box)(({ theme }) => ({
    background: '#fff',
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    animation: `${fadeIn} 0.6s ease-out`,
}));

const XummButton = styled(Link)(({ theme }) => ({
    background: theme.palette.primary.main,
    color: '#fff',
    padding: '12px 24px',
    borderRadius: 8,
    transition: 'all 0.2s ease-in-out',
    animation: `${fadeIn} 0.6s ease-out`,
    '&:hover': {
        background: theme.palette.primary.dark,
        transform: 'translateY(-2px)',
    },
}));

export default function LoginDialog(props) {
    const { qrUrl, nextUrl, open, handleClose } = props;
    const theme = useTheme();

    return (
        <QRDialog
            open={open}
            onClose={handleClose}
            disableScrollLock
        >
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <StyledDialogContent>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        fontWeight: 600,
                        textAlign: 'center',
                        animation: `${fadeIn} 0.4s ease-out`,
                    }}
                >
                    Connect with XUMM
                </Typography>

                <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                        textAlign: 'center',
                        animation: `${fadeIn} 0.5s ease-out`,
                    }}
                >
                    Scan the QR code with your XUMM app to connect
                </Typography>

                <QRContainer>
                    <Box
                        component="img"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                        alt="XUMM QR Code"
                        src={qrUrl}
                    />
                </QRContainer>

                <XummButton
                    underline="none"
                    target="_blank"
                    href={nextUrl}
                    rel="noreferrer noopener nofollow"
                >
                    <Typography variant="button">
                        Open in XUMM
                    </Typography>
                </XummButton>
            </StyledDialogContent>
        </QRDialog>
    );
}
