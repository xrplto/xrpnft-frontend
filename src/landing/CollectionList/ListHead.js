import PropTypes from 'prop-types';
// Material
import { visuallyHidden } from '@mui/utils';
import { withStyles } from '@mui/styles';
import {
    Box,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    useTheme,
    useMediaQuery
} from '@mui/material';
// ----------------------------------------------------------------------

const StickyTableCell = withStyles((theme) => ({
    head: {
        position: 'sticky',
        zIndex: 1000,
        top: 0
    }
}))(TableCell);

const TABLE_HEAD = (isMobile) => {
    if (isMobile) {
        return [
            {
                no: 0,
                id: 'name',
                label: 'Collection',
                align: 'left',
                width: '40%'
            },
            {
                no: 1,
                id: 'floor.amount',
                label: 'Floor',
                align: 'right',
                width: '30%'
            },
            {
                no: 2,
                id: 'totalVol24h',
                label: '24h Vol',
                align: 'right',
                width: '30%'
            }
        ];
    }

    return [
        { no: 0, id: 'name', label: 'Collection', align: 'left', width: '40%' },
        {
            no: 1,
            id: 'floor.amount',
            label: 'Floor',
            align: 'right',
            width: '10%'
        },
        { no: 2, id: 'totalVol24h', label: '24h Vol', align: 'right', width: '10%' },
        // { no: 3, id: 'volume', label: 'Volume', align: 'right', width: '10%' },
        {
            no: 4,
            id: 'totalVolume',
            label: 'Total Vol',
            align: 'right',
            width: '10%'
        },
        { no: 5, id: 'owners', label: 'Owners', align: 'right', width: '8%' },
        { no: 6, id: 'items', label: 'Items', align: 'right', width: '8%' }
    ];
};

export default function ListHead({}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <TableHead>
            <TableRow style={{ background: '#00000000' }}>
                {TABLE_HEAD(isMobile).map((headCell) => (
                    <StickyTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={false}
                        width={headCell.width}
                        sx={{
                            padding: 0,
                            py: 1,
                            ...(headCell.no > 0 && {
                                pl: 0,
                                pr: 0
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
