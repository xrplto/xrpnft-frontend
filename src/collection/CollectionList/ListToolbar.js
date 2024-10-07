// Material
import {
    alpha,
    styled,
    Box,
    Grid,
    Stack,
    Pagination,
    Select,
    MenuItem,
    Typography
} from '@mui/material';

// ----------------------------------------------------------------------

const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '&.MuiInputBase-root': {
        fontSize: '0.875rem',
        marginLeft: theme.spacing(1)
    }
}));

export default function ListToolbar({ rows, setRows, page, setPage, total}) {
    const num = total / rows;
    let page_count = Math.floor(num)
    if (num % 1 != 0) page_count++;
    
    const start = page * rows + 1;
    let end = start + rows - 1;
    if (end > total) end = total;

    const handleChangeRows = (event) => {
        setRows(parseInt(event.target.value, 10));
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage - 1);
        gotoTop(event);
    };

    const gotoTop = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );
    
        if (anchor) {
            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    };

    return (
        <Grid container spacing={2} alignItems="center" sx={{mt: 0, mb: 4}}>
            <Grid item xs={12} md={4} lg={4}>
                <Typography variant="body2" color="text.secondary">
                    Showing {start} - {end} out of {total}
                </Typography>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
                <Stack alignItems='center'>
                    <Pagination 
                        page={page+1} 
                        onChange={handleChangePage} 
                        count={page_count}
                        size="small"
                        siblingCount={1}
                        boundaryCount={1}
                    />
                </Stack>
            </Grid>

            <Grid item xs={12} md={4} lg={4}>
                <Stack direction='row' alignItems='center' justifyContent="flex-end">
                    <Typography variant="body2" color="text.secondary">
                        Show Rows
                    </Typography>
                    <CustomSelect
                        value={rows}
                        onChange={handleChangeRows}
                        size="small"
                    >
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </CustomSelect>
                </Stack>
            </Grid>
        </Grid>
    );
}
