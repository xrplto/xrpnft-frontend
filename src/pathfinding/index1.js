import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';

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
import { XRP_TOKEN } from 'src/utils/constants';

// Components
import QueryToken from './QueryToken';

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

export default function AddCostDialog({open, setOpen, openSnackbar, onAddCost}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [cost, setCost] = useState('');
    const [token, setToken] = useState(XRP_TOKEN);

    // useEffect(() => {
    //     setName('');
    //     setValue('');
    // }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const handleChangeCost = (e) => {
        const value = e.target.value;
        const newCost = value?value.replace(/[^0-9.]/g, ""):'';
        setCost(newCost);
    }

    const handleAddCost = () => {
        const numCost = GetNum(cost);
        if (numCost === 0)
            openSnackbar('Invalid cost', 'error');
        else {
            token.cost = cost;
            onAddCost(token);
            setOpen(false);
            setCost('');
            setToken(XRP_TOKEN);
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
                    <Typography variant="p4">Add Cost per Mint</Typography>
                </AddDialogTitle>

                <DialogContent>
                    <Stack sx={{pl:1, pr:1}}>
                        {/* <Typography variant="p5" sx={{mt: 0}}></Typography> */}
                        {/* <Typography variant="p6" sx={{mt: 2}}></Typography> */}
                        <QueryToken
                            cost={cost}
                            setCost={setCost}
                            token={token}
                            setToken={setToken}
                        />

                        <Stack spacing={2} sx={{mt: 3}}>
                            <Typography variant='p2'>Cost <Typography variant='s2'>*</Typography></Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    id='id_txt_costpermint'
                                    // autoFocus
                                    variant='outlined'
                                    placeholder=''
                                    onChange={handleChangeCost}
                                    autoComplete='new-password'
                                    value={cost}
                                    onFocus={event => {
                                        event.target.select();
                                    }}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    // sx={{width: 100}}
                                />
                                <Typography variant='p2'>{token?.name}</Typography>
                            </Stack>
                        </Stack>

                        {/* <Stack direction="row" spacing={2} sx={{mt: 3}}>
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
                        </Stack> */}

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:3, mb:3}}>
                            <Button
                                variant="outlined"
                                startIcon={<AddCircleIcon />}
                                size="small"
                                onClick={handleAddCost}
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
