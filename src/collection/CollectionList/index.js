import axios from 'axios';
import React from 'react';
import { useState, useEffect, useRef } from 'react';

// Material
import {
    Box,
    Table,
    TableBody,
    TableCell,
    ToggleButton,
    ToggleButtonGroup,
    useMediaQuery,
    useTheme,
    styled,
    Container,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';

// Utils
import { CollectionListType } from 'src/utils/constants';

// Context
import { useContext } from 'react';
import { AppContext } from 'src/AppContext';

// Components
// import SearchToolbar from './SearchToolbar';
import Row from './Row';
import ListHead from './ListHead';
import ListToolbar from './ListToolbar';
import NFTCardView from './NFTCardView';
import SearchBar from './SearchBar';

import { alpha } from '@mui/material/styles';
import { ViewList, ViewModule } from '@mui/icons-material';

const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

const StyledToggleButton = styled(ToggleButton)(
    ({ theme }) => `
        padding: 8px 16px;
        font-weight: 600;
        text-transform: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &.Mui-selected {
            background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
            color: ${theme.palette.common.white};
            
            &:hover {
                background: linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark});
            }
        }

        &:not(.Mui-selected) {
            color: ${theme.palette.text.primary};
            
            &:hover {
                background: rgba(${theme.palette.primary.main}, 0.05);
            }
        }
    `
);

const GlassBox = styled(Box)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backdropFilter: 'blur(20px)',
    background: alpha(theme.palette.background.paper, 0.15),
    padding: theme.spacing(3),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
    transition: 'all 0.3s ease-in-out',

    '&:hover': {
        boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        background: alpha(theme.palette.background.paper, 0.2)
    }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 120,
    marginLeft: theme.spacing(2),
    '& .MuiInputBase-root': {
        height: '40px', // Adjust this value to match your SearchBar height
    },
    '& .MuiSelect-select': {
        paddingTop: '8px',
        paddingBottom: '8px',
    },
}));

export default function CollectionList({ type, category }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState('all'); // Change this line to set 'all' as default
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('totalVol24h'); //vol24h

    const [total, setTotal] = useState(0);
    const [collections, setCollections] = useState([]);

    // Change the default choice to 'all'
    const [choice, setChoice] = useState('all');

    const [sync, setSync] = useState(0);

    const isMine = type === CollectionListType.MINE;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Change the default view mode to 'card'
    const [viewMode, setViewMode] = useState('card');

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCollections, setFilteredCollections] = useState([]);

    // Change the default sort option to 'Volume'
    const [sortOption, setSortOption] = useState('Volume');

    const [filteredAndSortedCollections, setFilteredAndSortedCollections] =
        useState([]);

    useEffect(() => {
        const loadCollections = () => {
            if (isMine && (!account || !accountToken)) {
                openSnackbar('Please login', 'error');
                return;
            }

            const body = {
                filter,
                type,
                page,
                limit: rows === 'all' ? total : rows, // Update this line
                order,
                orderBy,
                choice
            };

            if (type === CollectionListType.ALL) {
            } else if (type === CollectionListType.MINE) {
                body.account = account;
            } else if (type === CollectionListType.CATEGORY) {
                body.category = category;
            } else if (type === CollectionListType.LANDING) {
            }

            axios
                .post(`${BASE_URL}/collection/getlistbyorder`, body, {
                    headers: { 'x-access-token': accountToken }
                })
                .then((res) => {
                    try {
                        if (res.status === 200 && res.data) {
                            const ret = res.data;
                            setTotal(ret.count);
                            setCollections(ret.collections);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch((err) => {
                    console.log('err->>', err);
                });
        };
        loadCollections();
    }, [sync, order, orderBy, page, rows, account, total]);

    useEffect(() => {
        const filtered = collections.filter((collection) =>
            collection.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        let sorted = [...filtered];
        switch (sortOption) {
            case 'A-Z':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Z-A':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'Floor Low':
                sorted.sort(
                    (a, b) => (a.floor?.amount || 0) - (b.floor?.amount || 0)
                );
                break;
            case 'Floor High':
                sorted.sort(
                    (a, b) => (b.floor?.amount || 0) - (a.floor?.amount || 0)
                );
                break;
            case 'Volume':  // Change this line
                sorted.sort(
                    (a, b) => (b.totalVol24h || 0) - (a.totalVol24h || 0)
                );
                break;
            default:
                break;
        }

        setFilteredAndSortedCollections(sorted);
    }, [collections, searchTerm, sortOption]);

    const handleRequestSort = (event, id) => {
        const isDesc = orderBy === id && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(id);
        setPage(0);
        setSync(sync + 1);
    };

    const handleChangeChoice = (event, newValue) => {
        if (newValue && choice !== newValue) {
            setChoice(newValue);
            setSync(sync + 1);
        }
    };

    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    useEffect(() => {
        let sortedCollections = [...filteredCollections];
        switch (sortOption) {
            case 'A-Z':
                sortedCollections.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'Z-A':
                sortedCollections.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'Floor Low':
                sortedCollections.sort(
                    (a, b) => (a.floor?.amount || 0) - (b.floor?.amount || 0)
                );
                break;
            case 'Floor High':
                sortedCollections.sort(
                    (a, b) => (b.floor?.amount || 0) - (a.floor?.amount || 0)
                );
                break;
            case 'Volume':  // Change this line
                sortedCollections.sort(
                    (a, b) => (b.totalVol24h || 0) - (a.totalVol24h || 0)
                );
                break;
            default:
                break;
        }
        setFilteredCollections(sortedCollections);
    }, [sortOption, collections, searchTerm]);

    return (
        <Container maxWidth="xl">
            <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 } }}>
                <GradientTypography
                    variant="h2"
                    fontWeight="bold"
                    sx={{
                        fontSize: {
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem'
                        },
                        mb: 3
                    }}
                >
                    {type === CollectionListType.MINE ? 'My Collections' : ''}
                </GradientTypography>

                {type !== CollectionListType.LANDING && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ToggleButtonGroup
                                color="primary"
                                value={choice}
                                exclusive
                                onChange={handleChangeChoice}
                            >
                                <StyledToggleButton value="all">
                                    All
                                </StyledToggleButton>
                                <StyledToggleButton value="verified">
                                    Verified
                                </StyledToggleButton>
                            </ToggleButtonGroup>
                            <SearchBar
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <StyledFormControl size="small"> {/* Add size="small" here */}
                                <InputLabel id="sort-select-label">
                                    Sort
                                </InputLabel>
                                <Select
                                    labelId="sort-select-label"
                                    id="sort-select"
                                    value={sortOption}
                                    label="Sort"
                                    onChange={handleSortChange}
                                >
                                    <MenuItem value="Volume">Volume</MenuItem>  {/* Change this line */}
                                    <MenuItem value="Floor High">
                                        Floor High
                                    </MenuItem>
                                    <MenuItem value="Floor Low">
                                        Floor Low
                                    </MenuItem>
                                    <MenuItem value="A-Z">A-Z</MenuItem>
                                    <MenuItem value="Z-A">Z-A</MenuItem>
                                </Select>
                            </StyledFormControl>
                        </Box>

                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={handleViewModeChange}
                            aria-label="view mode"
                        >
                            <StyledToggleButton
                                value="card"
                                aria-label="card view"
                            >
                                <ViewModule />
                            </StyledToggleButton>
                            <StyledToggleButton
                                value="table"
                                aria-label="table view"
                            >
                                <ViewList />
                            </StyledToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                )}

                <GlassBox>
                    {viewMode === 'card' ? (
                        <NFTCardView
                            collections={filteredAndSortedCollections}
                            isMine={isMine}
                        />
                    ) : (
                        <Table
                            style={{
                                minWidth: isMobile ? undefined : '1000px'
                            }}
                        >
                            <ListHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {filteredAndSortedCollections.map(
                                    (row, idx) => {
                                        return (
                                            <Row
                                                key={idx}
                                                id={idx + 1}
                                                item={row}
                                                isMine={isMine}
                                            />
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    )}
                </GlassBox>
                <ListToolbar
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                    total={filteredAndSortedCollections.length}
                />
            </Box>
        </Container>
    );
}