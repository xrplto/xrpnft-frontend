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
    Typography
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

import { alpha } from '@mui/material/styles';

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

    const [choice, setChoice] = useState('verified');

    const [sync, setSync] = useState(0);

    const isMine = type === CollectionListType.MINE;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                })
                .then(function () {
                    // Always executed
                });
        };
        loadCollections();
    }, [sync, order, orderBy, page, rows, account, total]); // Add total to the dependency array

    useEffect(() => {
        var timer = null;

        const handleValue = () => {
            setPage(0);
            setSync(sync + 1);
        };

        timer = setTimeout(handleValue, 500);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [filter]);

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
                    <ToggleButtonGroup
                        color="primary"
                        value={choice}
                        exclusive
                        onChange={handleChangeChoice}
                        sx={{ mb: 4 }}
                    >
                        <StyledToggleButton value="all">All</StyledToggleButton>
                        <StyledToggleButton value="verified">
                            Verified
                        </StyledToggleButton>
                    </ToggleButtonGroup>
                )}

                <GlassBox>
                    <Table
                        style={{ minWidth: isMobile ? undefined : '1000px' }}
                    >
                        <ListHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {collections.map((row, idx) => {
                                return (
                                    <Row
                                        key={idx}
                                        id={page * Math.min(rows, total) + idx + 1} // Update this line
                                        item={row}
                                        isMine={isMine}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </GlassBox>
                <ListToolbar
                    rows={rows}
                    setRows={setRows}
                    page={page}
                    setPage={setPage}
                    total={total}
                />
            </Box>
        </Container>
    );
}
