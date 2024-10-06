import { useEffect, useState } from 'react';

// Material
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    Typography,
    TextField,
    Button,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'

// Components
import { fIntNumber } from 'src/utils/formatNumber';

export default function AttributeFilter({ attrs, setFilterAttrs }) {
    const [attrFilter, setAttrFilter] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const tempAttrs = attrs.map(attr => ({
            trait_type: attr.title,
            value: []
        }))
        setAttrFilter(tempAttrs)
    }, [attrs])

    const handleAttrChange = (title, key) => {
        setAttrFilter(prevAttrs => {
            const updatedAttrs = prevAttrs.map(attr => {
                if (attr.trait_type === title) {
                    const values = attr.value.includes(key)
                        ? attr.value.filter(v => v !== key)
                        : [...attr.value, key]
                    return { ...attr, value: values }
                }
                return attr
            })
            setFilterAttrs(updatedAttrs)
            return updatedAttrs
        })
    }

    const handleClearAll = (title) => {
        setAttrFilter(prevAttrs => {
            const updatedAttrs = prevAttrs.map(attr => 
                attr.trait_type === title ? { ...attr, value: [] } : attr
            )
            setFilterAttrs(updatedAttrs)
            return updatedAttrs
        })
    }

    const filteredAttrs = attrs.map(attr => ({
        ...attr,
        items: Object.fromEntries(
            Object.entries(attr.items).filter(([key]) => 
                key.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }))

    return (
        <Stack sx={{ mt: 0, pr: 0 }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search attributes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon color="action" />,
                }}
                sx={{ mb: 2 }}
            />
            {filteredAttrs.map((attr, idx) => {
                const title = attr.title;
                const items = attr.items;
                const count = Object.keys(items).length;

                return (
                    <Accordion
                        key={title}
                        disableGutters
                        sx={{
                            boxShadow: 'none',
                            '&:before': {
                                display: 'none',
                            },
                            '&.Mui-expanded': {
                                margin: 0,
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: 'background.paper',
                                '&.Mui-expanded': {
                                    minHeight: 48,
                                },
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                <Typography variant='subtitle1'>{title}</Typography>
                                <Typography variant='caption' color="text.secondary">{count}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <FormGroup sx={{ flexDirection: 'column' }}>
                                {Object.entries(items).map(([key, data]) => {
                                    const isChecked = attrFilter.find(elem => elem.trait_type === title)?.value?.includes(key) === true;
                                    return (
                                        <Stack key={title + key} direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                            <FormControlLabel
                                                label={
                                                    <Typography variant="body2">{key}</Typography>
                                                }
                                                control={
                                                    <Checkbox
                                                        checked={isChecked ?? false}
                                                        onChange={() => handleAttrChange(title, key)}
                                                        size="small"
                                                    />
                                                }
                                                sx={{ '& .MuiFormControlLabel-label': { flex: 1 } }}
                                            />
                                            <Typography variant='caption' color="text.secondary">{fIntNumber(data.count)}</Typography>
                                        </Stack>
                                    )
                                })}
                            </FormGroup>
                            <Button
                                variant="text"
                                size="small"
                                onClick={() => handleClearAll(title)}
                                sx={{ mt: 1 }}
                            >
                                Clear All
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                )
            })}
        </Stack>
    );
}