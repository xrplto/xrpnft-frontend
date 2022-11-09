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
import ErrorList from './ErrorList';
// ----------------------------------------------------------------------

export default function NFTs() {
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState('error');

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
                <ToggleButton value="error" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Error</ToggleButton>
                <ToggleButton value="nonftids" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>No NFTokenID</ToggleButton>
                <ToggleButton value="nosellofferids" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>No SellOfferID</ToggleButton>
                <ToggleButton value="stillhavingmint" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>Still having Mint</ToggleButton>
                <ToggleButton value="nodest" sx={{pl:2, pr:2, pt: 0.3, pb: 0.3}} style={{textTransform: 'none'}}>No Dest</ToggleButton>
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

            <ErrorList
                choice={choice}
                fitler={filter}
                setLoading={setLoading}
            />
        </>
    );
}
