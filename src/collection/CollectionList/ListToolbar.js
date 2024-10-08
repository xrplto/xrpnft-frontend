import React from 'react';
import {
    TablePagination,
    Box
} from '@mui/material';

export default function ListToolbar({
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
    total
}) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
            />
        </Box>
    );
}
