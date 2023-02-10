import { useState } from 'react';
import Decimal from 'decimal.js';

// Material
import {
    useTheme, useMediaQuery,
    styled,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
    TextField
} from '@mui/material';

import {
    Close as CloseIcon,
    AddCircle as AddCircleIcon
} from '@mui/icons-material';

// ----------------------------------------------------------------------
const AddDialog = styled(Dialog) (({ theme }) => ({
    backdropFilter: 'blur(1px)',
    WebkitBackdropFilter: 'blur(1px)', // Fix on Mobile
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
  
const AddDialogTitle = (props) => {
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

function GetNum(strNum) {
    let num = 0;
    try {
        num = new Decimal(strNum).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function AddMetaCountDialog({open, setOpen, openSnackbar, onAddMetaCount}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [count, setCount] = useState('1000');

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeCount = (e) => {
        const value = e.target.value;
        const newValue = value?value.replace(/[^0-9]/g, ""):'';
        setCount(newValue);
    }

    const handleAddCount = () => {
        const numCount = GetNum(count);
        if (numCount === 0) {
            openSnackbar('Invalid count', 'error');
        } else {
            onAddMetaCount(numCount);
            setOpen(false);
        }
    }

    return (
        <>
            <AddDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                // sx={{zIndex: 1302}}
                maxWidth='xs'
                // hideBackdrop={true}
            >
                <AddDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="p4">Add Count</Typography>
                </AddDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        <Stack spacing={2} sx={{mt: 3}}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant='s2'>Count</Typography>
                                <TextField
                                    id='id_txt_count'
                                    // autoFocus
                                    variant='standard'
                                    placeholder=''
                                    onChange={handleChangeCount}
                                    autoComplete='new-password'
                                    value={count}
                                    onFocus={event => {
                                        event.target.select();
                                    }}
                                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    // sx={{width: 100}}
                                />
                            </Stack>
                        </Stack>

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:3}}>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleIcon />}
                                size="small"
                                onClick={handleAddCount}
                            >
                                Add
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </AddDialog>
        </>
    );
}
