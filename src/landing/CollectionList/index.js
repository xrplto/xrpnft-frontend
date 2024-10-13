import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableContainer,
    Button,
    Box,
    useTheme,
    alpha,
    useMediaQuery,
    Typography,
    Link,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import Row from './Row';
import ListHead from './ListHead';

export default function CollectionList({ collections }) {
    const [visibleRows, setVisibleRows] = useState(10);
    const [allVisible, setAllVisible] = useState(false);
    const [volumeType, setVolumeType] = useState('24h');
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('totalVol24h');
    const [currency, setCurrency] = useState('XRP');
    const xrpToUsdRate = 1.8828845971187824; // 1 USD = 1.88 XRP
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleViewMore = () => {
        if (visibleRows + 10 >= collections.length) {
            setVisibleRows(collections.length);
            setAllVisible(true);
        } else {
            setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
        }
    };

    const handleViewAll = () => {
        window.location.href = '/collections';
    };

    const handleVolumeTypeChange = (event, newVolumeType) => {
        if (newVolumeType !== null) {
            setVolumeType(newVolumeType);
            setOrderBy(newVolumeType === '24h' ? 'totalVol24h' : 'totalVolume');
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleCurrencyChange = (event, newCurrency) => {
        if (newCurrency !== null) {
            setCurrency(newCurrency);
        }
    };

    const convertToUsd = (xrpValue) => {
        return Math.floor(xrpValue / xrpToUsdRate);
    };

    const sortedCollections = React.useMemo(() => {
        const comparator = (a, b) => {
            if (b[orderBy] < a[orderBy]) {
                return -1;
            }
            if (b[orderBy] > a[orderBy]) {
                return 1;
            }
            return 0;
        };

        return [...collections].sort((a, b) => {
            const orderValue = order === 'desc' ? 1 : -1;
            return orderValue * comparator(a, b);
        });
    }, [collections, order, orderBy]);

    return (
        <TableContainer
            sx={{
                width: '100%',
                maxWidth: isMobile ? '100%' : '80%',
                margin: '0 auto',
                borderRadius: theme.shape.borderRadius * 0.1,
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                background: alpha(theme.palette.background.paper, 0.15),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                boxShadow: `0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: `0 12px 48px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
                    background: alpha(theme.palette.background.paper, 0.2),
                    outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                    outlineOffset: '2px'
                },
                padding: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pr: 2,
                    pl: 2,
                    pt: 1,
                    pb: 1
                }}
            >
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        value={volumeType}
                        exclusive
                        onChange={handleVolumeTypeChange}
                        size="small"
                    >
                        <ToggleButton value="24h">24h</ToggleButton>
                        <ToggleButton value="all">All</ToggleButton>
                    </ToggleButtonGroup>
                    <ToggleButtonGroup
                        value={currency}
                        exclusive
                        onChange={handleCurrencyChange}
                        size="small"
                    >
                        <ToggleButton value="XRP">XRP</ToggleButton>
                        <ToggleButton value="USD">USD</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Link href="/collections" underline="none">
                    <Typography
                        variant="button"
                        color="primary"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        See All <span style={{ marginLeft: '4px' }}>&gt;</span>
                    </Typography>
                </Link>
            </Box>
            <Table
                size="small"
                sx={{
                    '& td, & th': {
                        py: 1,
                        px: isMobile ? 1 : 2
                    }
                }}
            >
                <ListHead
                    volumeType={volumeType}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    currency={currency}
                />
                <TableBody>
                    {sortedCollections
                        .slice(0, visibleRows)
                        .map((collection, index) => (
                            <Row
                                key={collection.uuid}
                                id={index + 1}
                                item={collection}
                                volumeType={volumeType}
                                currency={currency}
                                convertToUsd={convertToUsd}
                            />
                        ))}
                </TableBody>
            </Table>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 0.5
                }}
            >
                {allVisible ? (
                    <Button
                        onClick={handleViewAll}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minHeight: '24px', py: 0.5 }}
                    >
                        View All Collections
                    </Button>
                ) : visibleRows < collections.length ? (
                    <Button
                        onClick={handleViewMore}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minHeight: '24px', py: 0.5 }}
                    >
                        View More
                    </Button>
                ) : null}
            </Box>
        </TableContainer>
    );
}
