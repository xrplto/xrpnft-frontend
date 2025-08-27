import Decimal from 'decimal.js';

// Material
import {
    alpha, useTheme, useMediaQuery,
    styled,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// ----------------------------------------------------------------------
const WarningDialog = styled(Dialog) (({ theme }) => ({
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)', // Fix on Mobile
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
  
const WarningDialogTitle = (props) => {
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

const Label = styled(Typography)({
    color: alpha('#637381', 0.99)
});

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        border: 'none'
    }
}));

function GetNum(amount) {
    let num = 0;
    try {
        num = new Decimal(amount).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function WarningMintDialog({open, setOpen, onContinue, ipfsCount, metaLength }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClose = () => {
        setOpen(false);
    }

    const handleYes = () => {
        setOpen(false);
        onContinue();
    }

    const handleNo = () => {
        setOpen(false);
    }

    return (
        <WarningDialog
            fullScreen={fullScreen}
            onClose={handleClose}
            open={open}
            // sx={{zIndex: 1302}}
            maxWidth="xs"
            hideBackdrop={true}
            disableScrollLock
            disablePortal
            keepMounted
        >
            <WarningDialogTitle id="customized-dialog-title" onClose={handleClose}>
                <Stack direction="row" spacing={1}>
                    <ErrorOutlineIcon color="error" />
                    <Typography variant="p4" color="error">Warning!</Typography>
                </Stack>
            </WarningDialogTitle>

            <DialogContent>
                <Stack sx={{pl:1, pr:1}}>
                    <Typography variant="p5" sx={{mt: 2}}>Your IPFS pinned NFT images count({<Typography variant="s3" color="error">{ipfsCount}</Typography>}) and metadata length({<Typography variant="s3" color="error">{metaLength}</Typography>}) are not equal. Do you really want to continue?</Typography>
                    <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:4}}>
                        <Button
                            variant="contained"
                            onClick={handleNo}
                            color='primary'
                            // size='medium'
                        >
                            No
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleYes}
                            color='primary'
                            // size='medium'
                        >
                            Yes
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </WarningDialog>
    );
}
