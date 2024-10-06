import { useState, useMemo } from 'react';
import { isEqual } from 'lodash';

// Material
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    Typography,
    TextField,
    Divider,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'

// Utils
import { fIntNumber } from 'src/utils/formatNumber';

export default function FilterAttribute({ attrs, filterAttrs, setFilterAttrs }) {

    const [expanded, setExpanded] = useState(false);
    const [fAttrs, setFAttrs] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleAttrChange = (e) => {
        const value = e.target.value;
        setFAttrs(prev => {
            const updated = { ...prev };
            if (updated[value]) {
                delete updated[value];
            } else {
                updated[value] = true;
            }
            return updated;
        });
    }

    const handleApplyAttrFilter = () => {
        setFilterAttrs({ ...fAttrs });
    }

    const handleClearAttrFilter = () => {
        setFAttrs({});
        setExpanded(false);
    }

    const handleSelectAll = (title) => {
        const updatedAttrs = { ...fAttrs };
        attrs.find(attr => attr.title === title).items.forEach(item => {
            updatedAttrs[`${title}:${item}`] = true;
        });
        setFAttrs(updatedAttrs);
    }

    const filteredAttrs = useMemo(() => {
        if (!searchTerm) return attrs;
        return attrs.map(attr => ({
            ...attr,
            items: Object.fromEntries(
                Object.entries(attr.items).filter(([key]) => 
                    key.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        })).filter(attr => Object.keys(attr.items).length > 0);
    }, [attrs, searchTerm]);

    return (
        <Stack spacing={2} sx={{ mt: 2, pr: 2, pl: 2 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search attributes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                size="small"
            />

            <Stack direction="row" spacing={1} justifyContent="space-between">
                <Typography variant="h6">Attributes</Typography>
                <Stack direction="row" spacing={1}>
                    {Object.keys(fAttrs).length > 0 &&
                        <Button variant="outlined" onClick={handleClearAttrFilter} size="small">
                            Clear
                        </Button>
                    }
                    {!isEqual(fAttrs, filterAttrs) &&
                        <Button variant="contained" onClick={handleApplyAttrFilter} size="small">
                            Apply
                        </Button>
                    }
                </Stack>
            </Stack>

            <Divider />

            {filteredAttrs.map((attr, idx) => {
                const title = attr.title;
                const items = attr.items;
                const count = Object.keys(items).length;

                return (
                    <Accordion key={title} expanded={expanded === 'panel' + idx} onChange={handleAccordionChange('panel' + idx)} elevation={0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                <Typography variant='subtitle1'>{title}</Typography>
                                <Typography variant='body2' color="text.secondary">{count}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                <FormControlLabel
                                    label={<Typography variant='body2'>Select All</Typography>}
                                    control={<Checkbox onChange={() => handleSelectAll(title)} />}
                                />
                                <Divider sx={{ my: 1 }} />
                                {Object.entries(items).map(([key, value]) => {
                                    const checkValue = `${title}:${key}`;
                                    const isChecked = fAttrs[checkValue] === true;
                                    return (
                                        <Stack key={checkValue} direction="row" justifyContent="space-between" alignItems="center" width='100%'>
                                            <FormControlLabel
                                                label={<Typography variant='body2'>{key}</Typography>}
                                                value={checkValue}
                                                control={<Checkbox checked={isChecked} onChange={handleAttrChange} />}
                                            />
                                            <Typography variant='body2' color="text.secondary">{fIntNumber(value)}</Typography>
                                        </Stack>
                                    )
                                })}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Stack>
    );
}
