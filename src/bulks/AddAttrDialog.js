import { useState, useEffect } from 'react';
import Decimal from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';

// Material
import {
    styled, useTheme, useMediaQuery,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

// Components
import AddTraitDialog from './AddTraitDialog';

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

export default function AddAttrDialog({open, setOpen, openSnackbar, onAddAttr}) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [from, setFrom] = useState('1');
    const [to, setTo] = useState('1000');

    const [traits, setTraits] = useState([{type: 'Background', value: 'Snuff'}]);

    const [openAddTrait, setOpenAddTrait] = useState(false);

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

    const handleApplyAttr = () => {
        const numFrom = GetNum(from);
        const numTo = GetNum(to);
        if (numFrom === 0 || numTo === 0)
            openSnackbar('Invalid range', 'error');
        else if (traits.length === 0) {
            openSnackbar('Add at least one trait', 'error');
        } else {
            const newTraits = [];
            for (const t of traits) {
                const type = t.type;
                const value = t.value;
                newTraits.push({type, value});
            }
            const attr = {
                uuid: uuidv4(),
                from: numFrom,
                to: numTo,
                traits: newTraits,
            }
            onAddAttr(attr);
            setOpen(false);

            setFrom(numTo + 1);
            setTo(numTo + (numTo - numFrom) + 1);
        }
    }

    const onAddTrait = (type, value) => {
        const newTraits = [];
        let exist = false;
        for (const t of traits) {
            if (t.type === type) {
                exist = true;
                t.value = value;
            }
            newTraits.push(t);
        }

        if (!exist) {
            newTraits.push({type, value});
        }

        setTraits(newTraits);
    }

    const handleRemoveTrait = (type) => {
        const newTraits = [];
        for (const t of traits) {
            if (t.type === type) {
            } else {
                newTraits.push(t);
            }
        }
        setTraits(newTraits);
    }

    return (
        <>
            <AddTraitDialog
                open={openAddTrait}
                setOpen={setOpenAddTrait}
                openSnackbar={openSnackbar}
                onAddTrait={onAddTrait}
            />
            <AddDialog
                fullScreen={fullScreen}
                onClose={handleClose}
                open={open}
                // sx={{zIndex: 1302}}
                maxWidth='xs'
                // hideBackdrop={true}
            >
                <AddDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    <Typography variant="p4">Add traits by range</Typography>
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
                                    // sx={{width: 100}}
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
                                    // sx={{width: 100}}
                                />
                            </Stack>
                        </Stack>

                        <Stack spacing={2} sx={{mt: 3}}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant='p2'>Traits <Typography variant='s2'>*</Typography></Typography>
                                <Tooltip title='Add one more trait'>
                                    <IconButton onClick={()=>setOpenAddTrait(true)}>
                                        <AddCircleIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>

                            {traits.map((trait, idx) => (
                                <Stack spacing={1} sx={{pl: 1, pr:1}} key={idx}>
                                    <Stack direction='row' spacing={2} alignItems="center" justifyContent="space-between">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant='s2'>Type</Typography>
                                            <Typography variant='s6'>{trait.type}</Typography>
                                            <Typography variant='s2'>Value</Typography>
                                            <Typography variant='s6'>{trait.value}</Typography>
                                        </Stack>

                                        <IconButton onClick={()=>handleRemoveTrait(trait.type)}>
                                            <HighlightOffOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                    <Divider />
                                </Stack>
                            ))}
                        </Stack>

                        <Stack direction='row' spacing={2} justifyContent="center" sx={{mt:6, mb:1}}>
                            <Button
                                variant="outlined"
                                startIcon={<CheckCircleIcon />}
                                size="small"
                                onClick={handleApplyAttr}
                            >
                                Apply
                            </Button>
                        </Stack>
                    </Stack>
                </DialogContent>
            </AddDialog>
        </>
    );
}
