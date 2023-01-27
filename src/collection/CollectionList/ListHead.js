// Material
import { visuallyHidden } from '@mui/utils';
import { withStyles } from '@mui/styles';
import {
    Box,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel
} from '@mui/material';
// ----------------------------------------------------------------------

const StickyTableCell = withStyles((theme) => ({
    head: {
        position: "sticky",
        zIndex: 1000,
        top: 0
    }
})) (TableCell);

//    { id: 'holders', label: 'Holders', align: 'left', order: true },
//    { id: 'offers', label: 'Offers', align: 'left', order: true },

const TABLE_HEAD = [
    { no: 0, id: 'name', label: 'Collection', align: 'left', width: '10%', order: false },
    { no: 1, id: 'floor.amount', label: 'Floor', align: 'left', width: '10%', order: true },
    { no: 2, id: 'vol24h', label: '24h Vol', align: 'left', width: '10%', order: true },
    { no: 3, id: 'volume', label: 'Volume', align: 'left', width: '10%', order: true },
    { no: 4, id: 'totalVolume', label: 'Total Vol', align: 'left', width: '15%', order: true },
    { no: 5, id: 'owners', label: 'Owners', align: 'left', width: '10%', order: true },
    { no: 6, id: 'items', label: 'Items', align: 'left', width: '10%', order: true },
];

export default function ListHead({
    order,
    orderBy,
    onRequestSort
}) {
    const createSortHandler = (id) => (event) => {
        onRequestSort(event, id);
    };

    return (
        <TableHead>
            <TableRow
                style={{background: '#00000000'}}
            >
                {TABLE_HEAD.map((headCell) => (
                    <StickyTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={orderBy === headCell.id ? order : false}
                        width={headCell.width}
                        sx={{
                            ...(headCell.no > 0 && {
                                pl:0,
                                pr:0,
                            })
                        }}
                    >
                        <TableSortLabel
                            hideSortIcon
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'desc'}
                            onClick={headCell.order?createSortHandler(headCell.id):undefined}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </StickyTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
