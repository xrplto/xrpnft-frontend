import { useState, useEffect } from 'react';

// Material
import { withStyles } from '@mui/styles';
import {
    alpha, useTheme, useMediaQuery,
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

// Utils
import Decimal from 'decimal.js';

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

const Label = withStyles({
    root: {
        color: alpha('#637381', 0.99)
    }
})(Typography);

function GetNum(amount) {
    let num = 0;
    try {
        num = new Decimal(amount).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function DlgAddTrait({open, setOpen, openSnackbar, onAddTrait}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [type, setType] = useState('');
    const [value, setValue] = useState('');

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeType = (e) => {
        const value = e.target.value;
        setType(value);
    }

    const handleChangeValue = (e) => {
        const value = e.target.value;
        setValue(value);
    }

    const handleAddTrait = () => {
        if (!type)
            openSnackbar('Invalid type', 'error');
        else if (!value)
            openSnackbar('Invalid value', 'error');
        else {
            onAddTrait({type, value});
            setOpen(false);
            setType('');
            setValue('');
        }
    }

    return (
        <>
            <AddDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                sx={{zIndex: 1302}}
                maxWidth='xs'
                disableScrollLock
                // hideBackdrop={true}
            >
                <AddDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="p4">Add a trait</Typography>
                </AddDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        <Typography variant="p5" sx={{mt: 0}}></Typography>
                        <Typography variant="p6" sx={{mt: 2}}>The traits with the same type will overwrite the values.</Typography>

                        <Stack direction="row" spacing={2} sx={{mt: 3}}>
                            <TextField
                                id="outlined-size-type"
                                label="Type"
                                value={type}
                                size="small"
                                onChange={handleChangeType}
                            />

                            <TextField
                                id="outlined-size-value"
                                label="Value"
                                value={value}
                                size="small"
                                onChange={handleChangeValue}
                            />
                        </Stack>

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:3}}>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleIcon />}
                                size="small"
                                onClick={handleAddTrait}
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
