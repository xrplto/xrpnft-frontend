// Material
import {
    styled,
    Grid,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
    height: 64,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------
const CustomSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
    },
    '& .MuiSelect-select': {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1)
    }
}));

export default function NftListToolbar({ count, rows, setRows, page, setPage }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const num = count / rows;
    let page_count = Math.floor(num)
    if (num % 1 !== 0) page_count++;

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
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2, px: 2 }}>
            <Grid item xs={12} md={4} order={{ xs: 3, md: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Showing {start} - {end} out of {count}
                </Typography>
            </Grid>

            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
                <Stack alignItems='center'>
                    <Pagination 
                        page={page + 1} 
                        onChange={handleChangePage} 
                        count={page_count}
                        size={isMobile ? "small" : "medium"}
                    />
                </Stack>
            </Grid>

            <Grid item xs={12} md={4} order={{ xs: 2, md: 3 }}>
                <Stack direction='row' alignItems='center' justifyContent="flex-end">
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Show Rows:
                    </Typography>
                    <CustomSelect
                        value={rows}
                        onChange={handleChangeRows}
                        size="small"
                    >
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </CustomSelect>
                </Stack>
            </Grid>
        </Grid>
    );
}
