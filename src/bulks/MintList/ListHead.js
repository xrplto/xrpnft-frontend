// Material
import { visuallyHidden } from '@mui/utils';
import {
    Box,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    styled
} from '@mui/material';
// ----------------------------------------------------------------------

const StickyTableCell = styled(TableCell)({
    position: "sticky",
    zIndex: 1000,
    top: 0
});

const TABLE_HEAD = [
    { no: 0, id: 'id',        label: '#',         align: 'left',  width: '3%' },
    { no: 1, id: 'account',   label: 'Account',   align: 'left',  width: '40%'},
    { no: 2, id: 'cost',      label: 'Cost',      align: 'left', width: '15%'},
    { no: 3, id: 'quantity',  label: 'Quantity',  align: 'left', width: '15%'},
    { no: 4, id: 'purchased', label: 'Purchased', align: 'left', width: '15%'},
    { no: 5, id: 'date',      label: 'Date',      align: 'left', width: '10%'},
];

export default function ListHead({ }) {
    return (
        <TableHead>
            <TableRow
                style={{ background: '#00000000' }}
            >
                {TABLE_HEAD.map((headCell) => (
                    <StickyTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={false}
                        width={headCell.width}
                        sx={{
                        }}
                    >
                        {headCell.label}
                    </StickyTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
