// Material
import {
    Dialog,
    DialogTitle,
} from '@mui/material';

export default function BaseDialog({ close, render, isOpen, title, maxWidth }) {

    return (
        <Dialog open={isOpen} onClose={close} scroll='body' fullWidth maxWidth={maxWidth}
        >
            <DialogTitle sx={{ textAlign: 'center' }} >{title}</DialogTitle>
            {render}
        </Dialog>
    );
}