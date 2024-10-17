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
                width: '60%',
                order: false
            },
            {
                id: 'floorAndVolume',
                label: 'Floor / Volume',
                align: 'right',
                width: '40%',
                order: false
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

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: 'transparent',
    '& .MuiTableCell-root': {
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 0.5),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(1.5, 2),
        },
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
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={headCell.order ? createSortHandler(headCell.id) : undefined}
                        >
                            <Typography
                                variant={isMobile ? "caption" : "body2"}
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
