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
    setPage
}) {
    const theme = useTheme();
    const type = collection?.type;
    const extra = collection?.extra;
    const attrs = collection?.attrs || [];

    const handleFlagChange = (e) => {
        const value = parseInt(e.target.value);
        let newFilter = filter ^ value;
        setFilter(newFilter);
        setPage(0);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSubFilter(value);
        // Pass both the new subFilter value and the setFilter function
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
                        <Stack spacing={2} direction="row" alignItems="center">
                            <FactCheckIcon color="primary" />
                            <Typography variant="s3" color="primary.main">
                                Status & Sorting
                            </Typography>
                        </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup sx={{ flexDirection: 'col' }}>
                            {type === 'bulk' && (
                                <FormControlLabel
                                    label={
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            alignItems="center"
                                        >
                                            <Typography variant="s3">
                                                Buy with Mints{' '}
                                                <Typography
                                                    component="span"
                                                    variant="s3"
                                                    color="text.secondary"
                                                >
                                                    ({extra?.buyWithMints})
                                                </Typography>
                                            </Typography>
                                            <Tooltip title="Disabled on Spinning collections, only enabled on Bulk collections.">
                                                <Icon
                                                    icon={infoFilled}
                                                    color={
                                                        theme.palette.primary
                                                            .main
                                                    }
                                                />
                                            </Tooltip>
                                        </Stack>
                                    }
                                    value="1"
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
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            alignItems="center"
                                        >
                                            <Typography variant="s3">
                                                Recently Minted{' '}
                                                <Typography
                                                    component="span"
                                                    variant="s3"
                                                    color="text.secondary"
                                                >
                                                    ({extra?.boughtWithMints})
                                                </Typography>
                                            </Typography>
                                            <Tooltip title="Display recently Minted NFTs and being transferred to users. Or NFTs that pending to be accepted by users.">
                                                <Icon
                                                    icon={infoFilled}
                                                    color={
                                                        theme.palette.primary
                                                            .main
                                                    }
                                                />
                                            </Tooltip>
                                        </Stack>
                                    }
                                    value="2"
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
                                        Unlisted{' '}
                                        <Typography
                                            component="span"
                                            variant="s3"
                                            color="text.secondary"
                                        >
                                            ({extra?.notOnSaleCount})
                                        </Typography>
                                    </Typography>
                                }
                                value="8"
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
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                    >
                                        <Typography variant="s3">
                                            Rarity
                                        </Typography>
                                        <Tooltip title="Sort NFTs with rarity">
                                            <Icon
                                                icon={infoFilled}
                                                color={
                                                    theme.palette.primary.main
                                                }
                                            />
                                        </Tooltip>
                                    </Stack>
                                }
                                value="16"
                                control={
                                    <Checkbox
                                        checked={(filter & 16) !== 0}
                                        onChange={handleFlagChange}
                                        color="primary"
                                    />
                                }
                            />
                            <FormControl component="fieldset">
                                <Typography
                                    variant="s3"
                                    color="text.secondary"
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    Sort by:
                                </Typography>
                                <RadioGroup
                                    aria-label="sorting"
                                    name="sorting"
                                    value={subFilter}
                                    onChange={handleSortChange}
                                >
                                    <FormControlLabel
                                        value="latestActivity"
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="s3">
                                                Latest Activity
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        value="pricenoxrp"
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="s3">
                                                Listed (non-XRP)
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        value="pricexrpasc"
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="s3">
                                                XRP Price: Low to High
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        value="pricexrpdesc"
                                        control={<Radio color="primary" />}
                                        label={
                                            <Typography variant="s3">
                                                XRP Price: High to Low
                                            </Typography>
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                            {extra?.onSaleCount !== undefined && (
                                <Typography variant="s3" color="text.secondary" sx={{ mt: 2 }}>
                                    Total NFTs for sale: {extra.onSaleCount}
                                </Typography>
                            )}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </Stack>
            {attrs && attrs.length > 0 && (
                <Stack sx={{ pr: 0, mt: 1 }}>
                    <Accordion defaultExpanded style={{ margin: 0 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon color="primary" />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header2"
                        >
                            <Stack
                                spacing={2}
                                direction="row"
                                alignItems="center"
                            >
                                <BookmarkAddedIcon color="primary" />
                                <Typography variant="s3" color="primary.main">
                                    Attributes
                                </Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails style={{ padding: 0 }}>
                            <AttributeFilter
                                setFilterAttrs={setFilterAttrs}
                                attrs={attrs}
                            />
                        </AccordionDetails>
                    </Accordion>
                </Stack>
            )}
        </>
    );
}
