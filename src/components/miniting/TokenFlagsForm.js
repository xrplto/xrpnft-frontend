import * as React from 'react';

import {
    Checkbox,
    FormControlLabel,
    FormGroup
} from '@mui/material';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Utils
import { TOKEN_FLAGS } from 'utils/constants';

// Components
import { setFlags } from 'app/slices/ipfSlice';

export default function TokenFlagsForm() {

    const dispatch = useDispatch()
    const flags = useSelector(state => state.ipfs.flags)
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
