import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';

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
import { XRP_TOKEN } from 'src/utils/constants';

// Components
import QueryToken from 'src/components/QueryToken';

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

export default function AddAttrDialog({open, setOpen, openSnackbar, onAddAttr}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [from, setFrom] = useState('1');
    const [to, setTo] = useState('1000');

    const [type, setType] = useState('Background');
    const [value, setValue] = useState('Snuff');

    // useEffect(() => {
    //     setName('');
    //     setValue('');
    // }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeFrom = (e) => {
        const value = e.target.value;
        const newValue = value?value.replace(/[^0-9]/g, ""):'';
        setFrom(newValue);
    }

    const handleChangeTo = (e) => {
        const value = e.target.value;
        const newValue = value?value.replace(/[^0-9]/g, ""):'';
        setTo(newValue);
    }

    const handleChangeType = (e) => {
        const value = e.target.value;
        setType(value);
    }

    const handleChangeValue = (e) => {
        const value = e.target.value;
        setValue(value);
    }

    const handleAddAttr = () => {
        const attr = {};
        const numFrom = GetNum(from);
        const numTo = GetNum(to);
        if (numFrom === 0 || numTo === 0)
            openSnackbar('Invalid range', 'error');
        else if (!type || !value) {
            openSnackbar('Invalid type or value', 'error');
        } else {
            attr.uuid = uuidv4();
            attr.from = numFrom;
            attr.to = numTo;
            attr.type = type;
            attr.value = value;
            onAddAttr(attr);
            setOpen(false);

            setFrom(numTo + 1);
            setTo(numTo + (numTo - numFrom) + 1);
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
                    <Typography variant="p4">Add attribute by range</Typography>
                </AddDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        <Stack spacing={2} sx={{mt: 1}}>
                            <Typography variant='p2'>Range <Typography variant='s2'>*</Typography></Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant='s2'>From</Typography>
                                <TextField
                                    id='id_txt_from'
                                    // autoFocus
                                    variant='standard'
                                    placeholder=''
                                    onChange={handleChangeFrom}
                                    autoComplete='new-password'
                                    value={from}
                                    onFocus={event => {
                                        event.target.select();
                                    }}
                                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    sx={{width: 100}}
                                />
                                <Typography variant='s2'>To</Typography>
                                <TextField
                                    id='id_txt_to'
                                    // autoFocus
                                    variant='standard'
                                    placeholder=''
                                    onChange={handleChangeTo}
                                    autoComplete='new-password'
                                    value={to}
                                    onFocus={event => {
                                        event.target.select();
                                    }}
                                    inputProps={{min: 0, style: { textAlign: 'center' }}}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    sx={{width: 100}}
                                />
                            </Stack>
                        </Stack>

                        <Stack spacing={2} sx={{mt: 3}}>
                            <Typography variant='p2'>Attribute <Typography variant='s2'>*</Typography></Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
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
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
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
                        </Stack>

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:3}}>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleIcon />}
                                size="small"
                                onClick={handleAddAttr}
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
