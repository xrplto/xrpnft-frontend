import PropTypes from 'prop-types';
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

const TABLE_HEAD = [
    { id: '' },
    { no: 0, id: 'name', label: 'Collection', align: 'left', width: '10%' },
    { no: 1, id: 'floor.amount', label: 'Floor', align: 'right', width: '10%' },
    { no: 2, id: '24hvol', label: '24h Vol', align: 'right', width: '10%' },
    { no: 3, id: 'volume', label: 'Volume', align: 'right', width: '10%' },
    { no: 4, id: 'totalVolume', label: 'Total Vol', align: 'right', width: '15%' },
    { no: 5, id: 'owners', label: 'Owners', align: 'right', width: '10%' },
    { no: 6, id: 'items', label: 'Items', align: 'right', width: '10%' },
    { id: '' }
];

export default function TokenListHead({}) {
    return (
        <TableHead>
            <TableRow
                style={{background: '#00000000'}}
            >
                {TABLE_HEAD.map((headCell) => (
                    <StickyTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={false}
                        width={headCell.width}
                        sx={{
                            ...(headCell.id > 0 && {
                                pl:0,
                                pr:0,
                            })
                        }}
                    >
                        {headCell.label}
                    </StickyTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
