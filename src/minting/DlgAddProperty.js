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
import { fNumber } from 'src/utils/formatNumber';
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

export default function DlgAddProperty({open, setOpen, openSnackbar, onAddProperty}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [name, setName] = useState('');
    const [value, setValue] = useState('');

    // useEffect(() => {
    //     setName('');
    //     setValue('');
    // }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const handleChangeValue = (e) => {
        const value = e.target.value;
        setValue(value);
    }

    const handleAddProperty = () => {
        if (!name)
            openSnackbar('Invalid name', 'error');
        else if (!value)
            openSnackbar('Invalid value', 'error');
        else {
            onAddProperty({name, value});
            setOpen(false);
            setName('');
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
                    <Typography variant="p4">Add Property</Typography>
                </AddDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        <Typography variant="p5" sx={{mt: 0}}></Typography>
                        <Typography variant="p6" sx={{mt: 2}}>The properties with the same name will overwrite the values.</Typography>

                        <Stack direction="row" spacing={2} sx={{mt: 3}}>
                            <TextField
                                id="outlined-size-name"
                                label="Name"
                                value={name}
                                size="small"
                                onChange={handleChangeName}
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
                                onClick={handleAddProperty}
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
