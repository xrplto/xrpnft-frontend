import PropTypes from 'prop-types';
import { visuallyHidden } from '@mui/utils';
import { withStyles } from '@mui/styles';
import {
    Box,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    Typography // Import Typography for styling text
} from '@mui/material';

// Custom sticky cell style
const StickyTableCell = withStyles((theme) => ({
    head: {
        position: "sticky",
        zIndex: 1000,
        top: 0,
        backgroundColor: theme.palette.background.paper, // Ensure the background color matches the theme
    }
}))(TableCell);

// Table header data
const TABLE_HEAD = [
    { no: 0, id: 'name', label: 'Collection', align: 'left', width: '40%' },
    { no: 1, id: 'floor.amount', label: 'Floor', align: 'right', width: '10%' },
    { no: 2, id: 'vol24h', label: '24h Vol', align: 'right', width: '10%' },
    // { no: 3, id: 'volume', label: 'Volume', align: 'right', width: '10%' },
    { no: 4, id: 'totalVolume', label: 'Total Vol', align: 'right', width: '10%' },
    { no: 5, id: 'owners', label: 'Owners', align: 'right', width: '8%' },
    { no: 6, id: 'nfts', label: 'NFTs', align: 'right', width: '8%' },
];

// ListHead component
export default function ListHead() {
    return (
        <TableHead>
            <TableRow
              //  style={{ background: '#00000000' }} // Match this with your theme
            >
                {TABLE_HEAD.map((headCell) => (
                    <StickyTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={false}
                        style={{ width: headCell.width }} // Inline style for width consistency
                        sx={{
                            padding: theme => `${theme.spacing(1)} ${theme.spacing(2)}`,
                            // Other styles
                        }}
                    >
                        <Typography variant="subtitle1" component="div" style={{ fontSize: '1.1rem' }}>
                            {headCell.label}
                        </Typography>
                    </StickyTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
