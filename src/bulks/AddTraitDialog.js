import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';

// Material
import {
    alpha, useTheme, useMediaQuery,
    styled,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    Typography,
    TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

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

function GetNum(amount) {
    let num = 0;
    try {
        num = new Decimal(amount).toNumber();
        if (num < 0) num = 0;
    } catch (err) {}
    return num;
}

export default function AddTraitDialog({open, setOpen, openSnackbar, onAddTrait}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [type, setType] = useState('Background');
    const [value, setValue] = useState('Snuff');

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
        if (!type || !value) {
            openSnackbar('Invalid type or value', 'error');
        } else {
            onAddTrait(type, value);
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
                    <Typography variant="p4">Add one trait</Typography>
                </AddDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{mt: 2}}>
                            <Typography variant='s2'>Type</Typography>
                            <TextField
                                id='id_txt_type'
                                // autoFocus
                                variant='standard'
                                placeholder=''
                                onChange={handleChangeType}
                                autoComplete='new-password'
                                value={type}
                                onFocus={event => {
                                    event.target.select();
                                }}
                                inputProps={{min: 0, style: { textAlign: 'center' }}}
                                onKeyDown={(e) => e.stopPropagation()}
                                // sx={{width: 100}}
                            />
                            <Typography variant='s2'>Value</Typography>
                            <TextField
                                id='id_txt_value'
                                // autoFocus
                                variant='standard'
                                placeholder=''
                                onChange={handleChangeValue}
                                autoComplete='new-password'
                                value={value}
                                onFocus={event => {
                                    event.target.select();
                                }}
                                inputProps={{min: 0, style: { textAlign: 'center' }}}
                                onKeyDown={(e) => e.stopPropagation()}
                                // sx={{width: 100}}
                            />
                        </Stack>

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:6, mb:1}}>
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
