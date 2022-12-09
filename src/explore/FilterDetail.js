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
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Link,
    Radio,
    RadioGroup,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArticleIcon from '@mui/icons-material/Article';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

// Iconify
import { Icon } from '@iconify/react';
import infoFilled from '@iconify/icons-ep/info-filled';

// Components
import { FILTER_NFT_FLAGS } from 'src/utils/constants';
import FilterAttribute from './FilterAttribute';

export default function FilterDetail({collection, filter, setFilter, subFilter, setSubFilter, filterAttrs, setFilterAttrs}) {

    const type = collection?.type;
    const extra = collection?.extra;
    const attrs = collection?.attrs || [];

    const handleFlagChange = (e) => {
        const value = e.target.value;
        let newFilter = filter ^ value;
        if (value === '4') {
            // 8 4 2 1
            // 0 1 1 1
            newFilter &= 0x07;
        } else if (value === '8') {
            // 8 4 2 1
            // 1 0 1 1
            newFilter &= 0x0B;
        }
        setFilter(newFilter);
    }

    const handleOnSaleFlagChange = (event) => {
        const value = event.target.value;
        setSubFilter(value);
    };

    return (
        <Stack spacing={2} sx={{mt: 2, pr: 0}}>
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
                    {/* owners, pendingNfts, buyWithMints, boughtWithMints, onSaleCount */}
                    <FormGroup sx={{ flexDirection: 'col' }}>
                        <FormControlLabel
                            disabled={type !== "bulk"}
                            label={
                                <Stack direction="row" spacing={0.5}>
                                    <Typography variant={type !== "bulk"?'s4':'s3'}>Buy with Mints <Typography variant='s7'>({extra?.buyWithMints})</Typography></Typography>
                                    <Tooltip title="Disabled on Spinning collections, only enabled on Bulk collections.">
                                        <Icon icon={infoFilled} />
                                    </Tooltip>
                                </Stack>
                            }
                            value={1}
                            control={<Checkbox checked={(filter & 1) !== 0} onChange={handleFlagChange} />}
                        />
                        <FormControlLabel
                            label={
                                <Stack direction="row" spacing={0.5}>
                                    <Typography variant='s3'>Bought with Mints <Typography variant='s7'>({extra?.boughtWithMints})</Typography></Typography>
                                    <Tooltip title="Display NFTs that bought with Mints and being transferred to users. Or NFTs that pending to be accepted by users.">
                                        <Icon icon={infoFilled} />
                                    </Tooltip>
                                </Stack>
                            }
                            value={2}
                            control={<Checkbox checked={(filter & 2) !== 0} onChange={handleFlagChange} />}
                        />
                        <FormControlLabel
                            label={<Typography variant='s3'>On Sale <Typography variant='s7'>({extra?.onSaleCount})</Typography></Typography>}
                            value={4}
                            control={<Checkbox checked={(filter & 4) !== 0} onChange={handleFlagChange} />}
                        />

                        {(filter & 0x04) !== 0 &&
                            <FormControl sx={{ ml: 5 }}>
                                {/* <FormLabel id="on-sale-sub-filter">On Sale sub</FormLabel> */}
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={subFilter}
                                    onChange={handleOnSaleFlagChange}
                                >
                                    <FormControlLabel value="pricenoxrp" control={<Radio />} label="Price (noXRP)" />
                                    <FormControlLabel value="pricexrpasc" control={<Radio />} label="Price (XRP, Asc)" />
                                    <FormControlLabel value="pricexrpdesc" control={<Radio />} label="Price (XRP, Desc)" />
                                </RadioGroup>
                            </FormControl>
                        }

                        <FormControlLabel
                            label={<Typography variant='s3'>Idle <Typography variant='s7'>({extra?.notOnSaleCount})</Typography></Typography>}
                            value={8}
                            control={<Checkbox checked={(filter & 8) !== 0} onChange={handleFlagChange} />}
                        />
                    </FormGroup>

                    
                </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded style={{margin: 0}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header2"
                >
                    <Stack spacing={2} direction='row'>
                        <BookmarkAddedIcon />
                        <Typography variant='s3'>Attributes <Typography variant='s2'>(Comming soon!)</Typography></Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails style={{padding: 0}}>
                    {!attrs || attrs.length === 0 ?
                        <Stack alignItems="center">
                            <Typography variant='s7'>No Attributes</Typography>
                        </Stack>
                        :
                        <FilterAttribute attrs={attrs} filterAttrs={filterAttrs} setFilterAttrs={setFilterAttrs} />
                    }
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}
