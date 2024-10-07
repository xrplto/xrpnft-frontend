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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

// Iconify
import { Icon } from '@iconify/react';
import infoFilled from '@iconify/icons-ep/info-filled';

// Components
import AttributeFilter from './AttributeFilter';

export default function FilterDetail({
    collection,
    filter,
    setFilter,
    subFilter,
    setSubFilter,
    setFilterAttrs,
    setPage // reset the page when applying a filter
}) {
    const theme = useTheme();
    const type = collection?.type;
    const extra = collection?.extra;
    const attrs = collection?.attrs || [];

    const handleFlagChange = (e) => {
        const value = e.target.value;
        let newFilter = filter ^ value;
        if (value === '4') {
            newFilter &= 0x07;
        } else if (value === '8') {
            newFilter &= 0x0b;
        } else if (value === '16') {
            newFilter &= 0x13;
        }
        setFilter(newFilter);
        setPage(0);
    };

    const handleOnSaleFlagChange = (event) => {
        const value = event.target.value;
        setSubFilter(value);
        setPage(0)
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
                        <Stack spacing={2} direction="row" alignItems="center">
                            <FactCheckIcon color="primary" />
                            <Typography variant="s3" color="primary.main">Status</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup sx={{ flexDirection: 'col' }}>
                            {type === 'bulk' && (
                                <FormControlLabel
                                    label={
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="s3">
                                                Buy with Mints{' '}
                                                <Typography variant="s7" color="text.secondary">
                                                    ({extra?.buyWithMints})
                                                </Typography>
                                            </Typography>
                                            <Tooltip title="Disabled on Spinning collections, only enabled on Bulk collections.">
                                                <Icon icon={infoFilled} color={theme.palette.primary.main} />
                                            </Tooltip>
                                        </Stack>
                                    }
                                    value={1}
                                    control={
                                        <Checkbox
                                            checked={(filter & 1) !== 0}
                                            onChange={handleFlagChange}
                                            color="primary"
                                        />
                                    }
                                />
                            )}
                            {type !== 'normal' && (
                                <FormControlLabel
                                    label={
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Typography variant="s3">
                                                Recently Minted{' '}
                                                <Typography variant="s7" color="text.secondary">
                                                    ({extra?.boughtWithMints})
                                                </Typography>
                                            </Typography>
                                            <Tooltip title="Display recently Minted NFTs and being transferred to users. Or NFTs that pending to be accepted by users.">
                                                <Icon icon={infoFilled} color={theme.palette.primary.main} />
                                            </Tooltip>
                                        </Stack>
                                    }
                                    value={2}
                                    control={
                                        <Checkbox
                                            checked={(filter & 2) !== 0}
                                            onChange={handleFlagChange}
                                            color="primary"
                                        />
                                    }
                                />
                            )}
                            <FormControlLabel
                                label={
                                    <Typography variant="s3">
                                        On Sale{' '}
                                        <Typography variant="s7" color="text.secondary">
                                            ({extra?.onSaleCount})
                                        </Typography>
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

                            {(filter & 0x04) !== 0 && (
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
                            )}

                            <FormControlLabel
                                label={
                                    <Typography variant="s3">
                                        Idle{' '}
                                        <Typography variant="s7" color="text.secondary">
                                            ({extra?.notOnSaleCount})
                                        </Typography>
                                    </Typography>
                                }
                                value={8}
                                control={
                                    <Checkbox
                                        checked={(filter & 8) !== 0}
                                        onChange={handleFlagChange}
                                        color="primary"
                                    />
                                }
                            />

                            <FormControlLabel
                                label={
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Typography variant="s3">
                                            Rarity
                                        </Typography>
                                        <Tooltip title="Sort NFTs with rarity">
                                            <Icon icon={infoFilled} color={theme.palette.primary.main} />
                                        </Tooltip>
                                    </Stack>
                                }
                                value={16}
                                control={
                                    <Checkbox
                                        checked={(filter & 16) !== 0}
                                        onChange={handleFlagChange}
                                        color="primary"
                                    />
                                }
                            />
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </Stack>
            <Stack sx={{ pr: 0, mt: 1 }}>
                <Accordion defaultExpanded style={{ margin: 0 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon color="primary" />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header2"
                    >
                        <Stack spacing={2} direction="row" alignItems="center">
                            <BookmarkAddedIcon color="primary" />
                            <Typography variant="s3" color="primary.main">Attributes</Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails style={{ padding: 0 }}>
                        {!attrs || attrs.length === 0 ? (
                            <Stack alignItems="center">
                                <Typography variant="s7" mt={2} mb={2} color="text.secondary">
                                    No Attributes
                                </Typography>
                            </Stack>
                        ) : (
                            <AttributeFilter
                                setFilterAttrs={setFilterAttrs}
                                attrs={attrs}
                            />
                        )}
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </>
    );
}