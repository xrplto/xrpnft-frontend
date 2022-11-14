import axios from 'axios';
import { useEffect, useState } from 'react';
import Decimal from 'decimal.js';

// Material
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    Divider,
    FormControlLabel,
    FormGroup,
    Link,
    Stack,
    Typography,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArticleIcon from '@mui/icons-material/Article';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// Iconify
import { Icon } from '@iconify/react';

// Components
import { FILTER_NFT_FLAGS } from 'src/utils/constants';

export default function FilterDetail({filter, setFilter}) {

    const handleFlagChange = (e) => {
        const value = e.target.value;
        setFilter(filter ^ value);
    }

    return (
        <Stack spacing={2} sx={{mt: 2}}>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                >
                    <Stack spacing={2} direction='row'>
                        <FactCheckIcon />
                        <Typography variant='s3'>Status</Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup sx={{ flexDirection: 'col' }}>
                        {
                            FILTER_NFT_FLAGS.map((f) => (
                                <FormControlLabel
                                    key={f.value}
                                    label={<Typography variant='s3'>{f.label}</Typography>}
                                    value={f.value}
                                    control={
                                        <Checkbox checked={(filter & f.value) !== 0} onChange={handleFlagChange} />
                                    }
                                />
                            ))
                        }
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}
