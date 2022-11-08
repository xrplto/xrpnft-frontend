import { useState } from 'react';

// Material
import {
    InputAdornment,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';

// Loader
import { ClipLoader } from "react-spinners";

// Components
import NFTList from './NFTList';
// ----------------------------------------------------------------------

export default function NFTs({account}) {
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState('all');

    const handleChangeFilter = (e) => {
        setFilter(e.target.value);
    }

    const handleChangeChoice = (event, newValue) => {
        setChoice(newValue);
    };

    return (
        <>
            <ToggleButtonGroup
                color="primary"
                value={choice}
                exclusive
                // size="small"
                
                onChange={handleChangeChoice}
            >
                <ToggleButton value="all" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>All</ToggleButton>
                <ToggleButton value="collected" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Collected</ToggleButton>
                <ToggleButton value="created" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Created</ToggleButton>
                <ToggleButton value="pendingaccept" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Pending Accept</ToggleButton>
            </ToggleButtonGroup>
            <Stack direction="row">
                <TextField
                    id='textFilter'
                    // autoFocus
                    // fullWidth
                    variant='outlined'
                    placeholder='Filter'
                    margin='dense'
                    onChange={handleChangeFilter}
                    autoComplete='new-password'
                    inputProps={{autoComplete: 'off'}}
                    value={filter}
                    onFocus={event => {
                        event.target.select();
                    }}
                    sx={{pl:2, pr:2, pt: 0, pb: 0, mt: 4}}
                    onKeyDown={(e) => e.stopPropagation()}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                {loading && <ClipLoader color='#ff0000' size={15} /> }
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <NFTList
                account={account}
                choice={choice}
                fitler={filter}
                setLoading={setLoading}
            />
        </>
    );
}
