import PropTypes from 'prop-types';
// Material
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import {
    Box,
    TableRow,
    TableCell,
    TableHead,
    TableSortLabel,
    useTheme,
    useMediaQuery,
    Typography
} from '@mui/material';
// ----------------------------------------------------------------------

const StickyTableCell = styled(TableCell)(({ theme }) => ({
    position: 'sticky',
    zIndex: 1000,
    top: 0,
    backgroundColor: theme.palette.mode === 'light'
        ? 'rgba(255, 255, 255, 0.5)'  // More transparent white for light mode
        : 'rgba(0, 0, 0, 0.3)',       // More transparent black for dark mode
    backdropFilter: 'blur(10px)',     // Increased blur effect for better readability
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    transition: theme.transitions.create(['background-color', 'box-shadow'])
}));

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
                label: 'Floor Price',
                align: 'right',
                width: '30%'
            },
            {
                no: 2,
                id: 'totalVol24h',
                label: '24h Volume',
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
            label: 'Floor Price',
            align: 'right',
            width: '10%'
        },
        {
            no: 2,
            id: 'totalVol24h',
            label: '24h Volume',
            align: 'right',
            width: '10%'
        },
        // { no: 3, id: 'volume', label: 'Volume', align: 'right', width: '10%' },
        {
            no: 4,
            id: 'totalVolume',
            label: 'Total Volume',
            align: 'right',
            width: '10%'
        },
        { no: 5, id: 'owners', label: 'Owners', align: 'right', width: '8%' },
        {
            no: 6,
            id: 'items',
            label: 'Total Items',
            align: 'right',
            width: '8%'
        }
    ];
};

export default function ListHead({}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <TableHead>
            <TableRow>
                {TABLE_HEAD(isMobile).map((headCell) => (
                    <StickyTableCell
                        key={headCell.id}
                        align={headCell.align}
                        sortDirection={false}
                        width={headCell.width}
                        sx={{
                            padding: theme.spacing(2),
                            ...(headCell.no > 0 && {
                                pl: 1,
                                pr: 1
                            })
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            noWrap
                            sx={{
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                color: theme.palette.text.primary
                            }}
                        >
                            {headCell.label}
                        </Typography>
                    </StickyTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
