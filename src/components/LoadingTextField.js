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

export default function LoadingTextField({ type, value, setValid, startText, ...props }) {
    const TEXT_EMPTY = 0;
    const TEXT_CHECKING = 1;
    const TEXT_VALID = 2;
    const TEXT_INVALID = 3;

    const BASE_URL = 'https://api.xrpnft.com/api';
    const [status, setStatus] = useState(TEXT_EMPTY);

    const checkValidation = (text) => {
        setStatus(TEXT_CHECKING);

        const body = {};
        body.text = text;
        body.type = type;

        // https://api.xrpnft.com/api/validation
        axios.post(`${BASE_URL}/validation`, body).then(res => {
            try {
                if (res.status === 200 && res.data) {
                    const ret = res.data.status;

                    if (ret)
                        setStatus(TEXT_VALID);
                    else
                        setStatus(TEXT_INVALID);
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
        var timer = null;

        const handleValue = () => {
            if (!value)
                setStatus(TEXT_EMPTY)
            else
                checkValidation(value);
        }

        setValid(false);
        timer = setTimeout(handleValue, 500);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [value]);

    useEffect(() => {
        if (setValid) {
            if (status === TEXT_VALID)
                setValid(true);
            else
                setValid(false);
        }
    }, [status, setValid]);

    return (
        <FormControl sx={{ m: 1 }} variant="outlined">
            <OutlinedInput
                {...props}
                value={value}
                // autoFocus
                // onFocus={event => {
                //     event.target.select();
                // }}
                autoComplete='new-password'
                inputProps={{autoComplete: 'off'}}
                margin='dense'
                endAdornment={
                    <InputAdornment position="end">
                        {status === 1 && <ClipLoader color='#ff0000' size={15} /> }
                        {status === 2 && <CheckCircleIcon color='success'/> }
                        {status === 3 && <ErrorIcon color='error' />}
                    </InputAdornment>
                }
                startAdornment={
                    <InputAdornment position="start" sx={{mr:0.1}}>
                        {startText}
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
