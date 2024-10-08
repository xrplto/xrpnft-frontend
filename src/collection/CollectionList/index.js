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
        height: '40px' // Adjust this value to match your SearchBar height
    },
    '& .MuiSelect-select': {
        paddingTop: '8px',
        paddingBottom: '8px'
    }
}));

export default function CollectionList({ type, category }) {
    const BASE_URL = 'https://api.xrpnft.com/api';

    const { accountProfile, openSnackbar } = useContext(AppContext);
    const account = accountProfile?.account;
    const accountToken = accountProfile?.token;

    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50); // Set a default value for rows per page
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('totalVol24h');

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
                limit: rowsPerPage,
                order,
                orderBy: sortOption === 'Volume' ? 'totalVol24h' : orderBy,
                choice
            };

            if (type === CollectionListType.ALL) {
            } else if (type === CollectionListType.MINE) {
                body.account = account;
            } else if (type === CollectionListType.CATEGORY) {
                body.category = category;
            } else if (type === CollectionListType.LANDING) {
            }

            console.log('Request body:', body);

            axios
                .post(`${BASE_URL}/collection/getlistbyorder`, body, {
                    headers: { 'x-access-token': accountToken }
                })
                .then((res) => {
                    if (res.status === 200 && res.data) {
                        const { count, collections } = res.data;
                        console.log(`Received ${collections.length} collections out of ${count} total`);
                        setTotal(count);
                        setCollections(collections);
                        
                        // Apply initial filtering and sorting
                        const filtered = collections.filter((collection) =>
                            collection.name.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                        const sorted = sortCollections(filtered, sortOption);
                        setFilteredAndSortedCollections(sorted);
                    }
                })
                .catch((err) => {
                    console.error('API Error:', err);
                    openSnackbar('Failed to load collections', 'error');
                });
        };
        loadCollections();
    }, [sync, order, orderBy, page, rowsPerPage, account, searchTerm, sortOption]); // Update dependencies

    // New function to handle sorting
    const sortCollections = (collections, sortOption) => {
        return [...collections].sort((a, b) => {
            switch (sortOption) {
                case 'A-Z':
                    return a.name.localeCompare(b.name);
                case 'Z-A':
                    return b.name.localeCompare(a.name);
                case 'Floor Low':
                    return (a.floor?.amount || 0) - (b.floor?.amount || 0);
                case 'Floor High':
                    return (b.floor?.amount || 0) - (a.floor?.amount || 0);
                case 'Volume':
                    return (b.totalVol24h || 0) - (a.totalVol24h || 0);
                default:
                    return 0;
            }
        });
    };

    // Update search and sort handlers
    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        const filtered = collections.filter((collection) =>
            collection.name.toLowerCase().includes(term.toLowerCase())
        );
        const sorted = sortCollections(filtered, sortOption);
        setFilteredAndSortedCollections(sorted);
    };

    const handleSortChange = (event) => {
        const option = event.target.value;
        setSortOption(option);
        if (option === 'Volume') {
            setOrderBy('totalVol24h');
            setOrder('desc');
        }
        setSync(sync + 1);
    };

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                            <StyledFormControl size="small">
                                {' '}
                                {/* Add size="small" here */}
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
                                    <MenuItem value="Volume">Volume</MenuItem>{' '}
                                    {/* Change this line */}
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
                                {filteredAndSortedCollections.map((row, idx) => (
                                    <Row
                                        key={row._id}
                                        id={page * rowsPerPage + idx + 1} // Update the id calculation
                                        item={row}
                                        isMine={isMine}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </GlassBox>
                <ListToolbar
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    total={total}
                />
            </Box>
        </Container>
    );
}