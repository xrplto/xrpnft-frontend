// Material
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Stack,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

// Iconify
import { Icon } from '@iconify/react';
import infoFilled from '@iconify/icons-ep/info-filled';

// Components

export default function FilterDetail({ boughtWithMints, onSaleCount, filter, setFilter, subFilter, setSubFilter, setPage }) {
    const theme = useTheme();

    const handleFlagChange = (e) => {
        const value = e.target.value;
        let newFilter = filter ^ value;
        if (value === '4') {
            newFilter &= 0x07;
        } else if (value === '8') {
            newFilter &= 0x0B;
        }
        setFilter(newFilter);
        setPage(0);
    }

    const handleOnSaleFlagChange = (event) => {
        const value = event.target.value;
        setSubFilter(value);
        setPage(0);
    };

    return (
        <>
            <Stack sx={{ pr: 0 }}>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon color="primary" />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Stack spacing={2} direction='row' alignItems="center">
                            <FactCheckIcon color="primary" />
                            <Typography variant='s3' color="primary.main">Status</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup sx={{ flexDirection: 'col' }}>
                            <FormControlLabel
                                label={
                                    <Typography variant='s3'>
                                        On Sale{' '}
                                        {onSaleCount > 0 && (
                                            <Typography variant='s7' color="text.secondary">
                                                ({onSaleCount})
                                            </Typography>
                                        )}
                                    </Typography>
                                }
                                value={4}
                                control={
                                    <Checkbox 
                                        checked={(filter & 4) !== 0} 
                                        onChange={handleFlagChange}
                                        color="primary"
                                    />
                                }
                            />

                            {(filter & 0x04) !== 0 &&
                                <FormControl sx={{ ml: 5 }}>
                                    <RadioGroup
                                        aria-labelledby="demo-controlled-radio-buttons-group"
                                        name="controlled-radio-buttons-group"
                                        value={subFilter}
                                        onChange={handleOnSaleFlagChange}
                                    >
                                        <FormControlLabel 
                                            value="pricenoxrp" 
                                            control={<Radio color="primary" />} 
                                            label="Price (noXRP)" 
                                        />
                                        <FormControlLabel 
                                            value="pricexrpasc" 
                                            control={<Radio color="primary" />} 
                                            label="Price (XRP, Asc)" 
                                        />
                                        <FormControlLabel 
                                            value="pricexrpdesc" 
                                            control={<Radio color="primary" />} 
                                            label="Price (XRP, Desc)" 
                                        />
                                    </RadioGroup>
                                </FormControl>
                            }
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </>
    );
}
