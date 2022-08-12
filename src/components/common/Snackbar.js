import * as React from 'react';

// Material
import {
    Alert as MuiAlert,
    Snackbar
} from '@mui/material';

// Utils
import { SnackbarProps } from 'utils/types';

// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
// });

XSnackbar.propTypes = SnackbarProps

export default function XSnackbar({ isOpen, close, message, variant }) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        close()
    };

    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} severity={variant} sx={{ width: '100%' }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
}
