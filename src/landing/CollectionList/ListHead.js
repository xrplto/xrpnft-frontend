import React from 'react';
import PropTypes from 'prop-types';
// Material
import { visuallyHidden } from '@mui/utils';
import {
    Box,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    useTheme,
    useMediaQuery,
    Typography,
    styled
} from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = (isMobile, volumeType, currency) => {
    if (isMobile) {
        return [
            {
                id: 'name',
                label: 'Collection',
                align: 'left',
                width: '50%',
                order: false
            },
            {
                id: 'floor.amount',
                label: `Floor`,
                align: 'right',
                width: '25%',
                order: true
            },
            {
                id: volumeType === '24h' ? 'totalVol24h' : 'totalVolume',
                label: `${volumeType === '24h' ? '24h Vol' : 'Total Vol'}`,
                align: 'right',
                width: '25%',
                order: true
            }
        ];
    }
    return [
        {
            id: 'name',
            label: 'Collection',
            align: 'left',
            width: '40%',
            order: false
        },
        {
            id: 'floor.amount',
            label: `Floor (${currency})`,
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: volumeType === '24h' ? 'totalVol24h' : 'totalVolume',
            label: `${volumeType === '24h' ? '24h Vol' : 'Total Vol'} (${currency})`,
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: 'owners',
            label: 'Owners',
            align: 'right',
            width: '15%',
            order: true
        },
        {
            id: 'items',
            label: 'Supply',
            align: 'right',
            width: '15%',
            order: true
        }
    ];
};

// Add this styled component
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: 'transparent',
    '& .MuiTableCell-root': {
        backgroundColor: 'transparent',
    },
}));

export default function ListHead({ order, orderBy, onRequestSort, volumeType, currency }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <StyledTableHead>
            <TableRow>
                {TABLE_HEAD(isMobile, volumeType, currency).map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.width}
                        sx={{ py: 1, px: isMobile ? 0.5 : 2 }}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={headCell.order ? createSortHandler(headCell.id) : undefined}
                        >
                            <Typography
                                variant={isMobile ? "caption" : "body1"}
                                fontWeight="600"
                                noWrap
                            >
                                {headCell.label}
                            </Typography>
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </StyledTableHead>
    );
}

ListHead.propTypes = {
    order: PropTypes.oneOf(['asc', 'desc']),
    orderBy: PropTypes.string,
    onRequestSort: PropTypes.func.isRequired,
    volumeType: PropTypes.oneOf(['24h', 'all']).isRequired,
    currency: PropTypes.string.isRequired
};
