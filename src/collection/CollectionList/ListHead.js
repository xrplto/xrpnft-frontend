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

// Add this styled component
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '&.MuiTableHead-root': {
        backgroundColor: 'transparent',
    },
    '& .MuiTableCell-root': {
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

const TABLE_HEAD = (isMobile) => {
    if (isMobile) {
        return [
            {
                no: 0,
                id: 'name',
                label: 'Collection',
                align: 'left',
                width: '40%',
                order: false
            },
            {
                no: 1,
                id: 'floor.amount',
                label: 'Floor',
                align: 'right',
                width: '30%',
                order: true
            },
            {
                no: 2,
                id: 'totalVol24h',
                label: '24h Vol',
                align: 'right',
                width: '30%',
                order: true
            }
        ];
    }
    return [
        {
            no: 0,
            id: 'name',
            label: 'Collection',
            align: 'left',
            width: '40%',
            order: false
        },
        {
            no: 1,
            id: 'floor.amount',
            label: 'Floor',
            align: 'right',
            width: '10%',
            order: true
        },
        {
            no: 2,
            id: 'totalVol24h',
            label: '24h Vol',
            align: 'right',
            width: '10%',
            order: true
        },
        // { no: 3, id: 'volume', label: 'Volume', align: 'right', width: '10%', order: true },
        {
            no: 4,
            id: 'totalVolume',
            label: 'Total Vol',
            align: 'right',
            width: '10%',
            order: true
        },
        {
            no: 5,
            id: 'owners',
            label: 'Owners',
            align: 'right',
            width: '8%',
            order: true
        },
        {
            no: 6,
            id: 'items',
            label: 'Items',
            align: 'right',
            width: '8%',
            order: true
        }
    ];
};

export default function ListHead({ order, orderBy, onRequestSort }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const createSortHandler = (id) => (event) => {
        onRequestSort(event, id);
    };

    return (
        <StyledTableHead>
            <TableRow>
                {TABLE_HEAD(isMobile).map((headCell) => (
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
                            onClick={
                                headCell.order
                                    ? createSortHandler(headCell.id)
                                    : undefined
                            }
                        >
                            <Typography
                                variant={isMobile ? "body2" : "body1"}
                                fontWeight="600"
                                noWrap
                            >
                                {headCell.label}
                            </Typography>
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
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
    onRequestSort: PropTypes.func.isRequired
};
