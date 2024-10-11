// Material
import {
    styled,
    Grid,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Toolbar
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 64,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));


// ----------------------------------------------------------------------
const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline' : {
        border: 'none'
    }
}));

export default function BulkToolbar({ count, rows, setRows, page, setPage, onRefresh }) {
    const num = count / rows;
    let page_count = Math.floor(num)
    if (num % 1 != 0) page_count++;

    const start = page * rows + 1;
    let end = start + rows - 1;
    if (end > count) end = count;

    const handleChangeRows = (event) => {
        setRows(parseInt(event.target.value, 10));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
        gotoTop(event);
    };

    const gotoTop = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-tab-anchor',
        );
    
        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
            <Grid container item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Stack alignItems='center'>
                    <Pagination page={page+1} onChange={handleChangePage} count={page_count} size="small"/>
                </Stack>
            </Grid>

            <Grid container item xs={6} md={4} lg={4}>
                Showing {start} - {end} out of {count}
            </Grid>

            <Grid container item xs={0} md={4} lg={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Stack alignItems='center'>
                    <Pagination page={page+1} onChange={handleChangePage} count={page_count}/>
                </Stack>
            </Grid>

            <Grid container item xs={6} md={4} lg={4} justifyContent="flex-end">
                <Stack direction='row' alignItems='center'>
                    Show Rows
                    <CustomSelect
                        value={rows}
                        onChange={handleChangeRows}
                    >
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </CustomSelect>
                </Stack>
            </Grid>

            <Tooltip title="Refresh">
                <IconButton onClick={onRefresh}>
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
        </Stack>
    );
}
