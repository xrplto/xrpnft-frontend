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
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Components
import { fIntNumber } from 'src/utils/formatNumber';

export default function AttributeFilter({ attrs, setFilterAttrs }) {

    const [expanded, setExpanded] = useState(false);
    const [attrFilter, setAttrFilter] = useState([])

    useEffect(() => {
        const tempAttrs = []
        for (const attr of attrs) {
            tempAttrs.push({
                trait_type: attr.title,
                value: []
            })
        }
        setAttrFilter(tempAttrs)

    }, [attrs])

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleAttrChange = (title, key) => {

        const tempAttrs = [...attrFilter]
        const found = tempAttrs.find(elem => elem.trait_type === title)

        if (found) {
            if (found.value.includes(key)) {
                let values = [...found.value]
                values.splice(found.value.indexOf(key), 1)
                found.value = values
            } else {
                found.value.push(key)
            }

            setAttrFilter(tempAttrs)
            setFilterAttrs(tempAttrs)
        }
    }

    return (
        <Stack sx={{ mt: 0, pr: 0 }}>
            {
                attrs.map((attr, idx) => {
                    const title = attr.title;
                    const items = attr.items;

                    const count = Object.keys(items).length;

                    return (
                        <Accordion
                            key={title}
                            expanded={expanded === 'panel' + idx}
                            onChange={handleAccordionChange('panel' + idx)}
                            square
                            disableGutters
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                // square
                                disableGutters
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                    <Typography variant='s5'>{title}</Typography>
                                    <Typography variant='s7'>{count}</Typography>
                                </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormGroup sx={{ flexDirection: 'col' }}>
                                    {
                                        Object.keys(items).map((key) => {
                                            const value = items[key];
                                            const isChecked = attrFilter.find(elem => elem.trait_type === title)?.value?.includes(key) === true;
                                            return (
                                                <Stack key={title + key} direction="row" justifyContent="space-between" alignItems="center" width='100%' pr={1}>
                                                    <FormControlLabel
                                                        label={
                                                            <Typography >{key}</Typography>
                                                        }
                                                        // value={checkValue}
                                                        control={<Checkbox checked={isChecked ?? false} onChange={() => handleAttrChange(title, key)} />}
                                                    />
                                                    <Typography variant='s7'>{fIntNumber(value)}</Typography>
                                                </Stack>
                                            )
                                        })
                                    }
                                </FormGroup>
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
        </Stack>
    );
}