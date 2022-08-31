import * as React from 'react';

// Material
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
} from '@mui/material';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setFlags } from 'src/redux/statusSlice';

// Utils
import { TOKEN_FLAGS } from 'src/utils/constants';

export default function TokenFlagsForm() {

    const dispatch = useDispatch()
    const flags = useSelector(state => state.status.flags)
    const handleFlagChange = (e) => {
        // if (NON_FLAGS.indexOf(flags ^ e.target.value) === -1)
            dispatch(setFlags(flags ^ e.target.value))
    }
    return (
        <FormGroup sx={{ flexDirection: 'row' }}>
            {
                TOKEN_FLAGS.map((flag) => (
                    <FormControlLabel
                        key={flag.value}
                        label={flag.label}
                        value={flag.value}
                        control={
                            <Checkbox checked={(flags & flag.value) !== 0} onChange={handleFlagChange} />
                        }
                    />
                ))
            }
        </FormGroup>
    );
}
