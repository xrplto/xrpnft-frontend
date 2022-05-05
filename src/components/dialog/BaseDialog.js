import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    Divider,
} from '@mui/material';

BaseDialog.propTypes = {
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    render: PropTypes.node,
    title: PropTypes.string
};

export default function BaseDialog({ close, render, isOpen, title }) {

    return (
        <Dialog open={isOpen} onClose={close} scroll='body' fullWidth maxWidth='md'>
            <DialogTitle sx={{ textAlign: 'center' }} >{title}</DialogTitle>
            <Divider />
            {render}
            <Divider />
        </Dialog>
    );
}