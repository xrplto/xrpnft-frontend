import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

// Material
import {
    FormControl,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Loader
import { ClipLoader } from "react-spinners";

// Iconify
import { Icon } from '@iconify/react';

export default function LoadingTextField({ value, type, onChangeValue, ...props }) {
    const BASE_URL = 'https://api.xrpnft.com/api';
    const [status, setStatus] = useState(0);
    const [text, setText] = useState(value);

    const checkValidation = () => {
        const body = {};
        body.text = text;
        body.type = type;

        // https://api.xrpnft.com/api/validation
        axios.post(`${BASE_URL}/validation`, body).then(res => {
            try {
                if (res.status === 200 && res.data) {
                }
            } catch (error) {
                console.log(error);
            }
        }).catch(err => {
            console.log("err->>", err);
        }).then(function () {
            // Always executed
        });
    }

    useEffect(() => {
        if (!text)
            setStatus(0)
        // else
        //     checkValidation();
    }, [text]);

    return (
        <FormControl sx={{ m: 1 }} variant="outlined">
            <OutlinedInput
                {...props}
                autoComplete='new-password'
                onChange={(e) => {
                    const value = e.target.value;
                    setText(value);
                    onChangeValue(value);

                    if (!value)
                        setStatus(0);
                    else {
                        setStatus(1);
                        checkValidation();
                    }
                        
                }}
                endAdornment={
                    <InputAdornment position="end">
                        {status === 1 && <ClipLoader color='#ff0000' size={15} /> }
                        {status === 2 && <CheckCircleIcon color='success'/> }
                        {status === 3 && <ErrorIcon color='error' />}
                    </InputAdornment>
                }
                sx={{
                    '&.MuiTextField-root': {
                        marginTop: 1
                    }
                }}
            />
            <FormHelperText id="outlined-helper-text"></FormHelperText>
        </FormControl>
    );
}
