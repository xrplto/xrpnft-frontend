import React from 'react';
import { Box, Table, TableContainer, Paper, TableBody, useMediaQuery, useTheme } from '@mui/material';
import Row from './Row';
import ListHead from './ListHead';

export default function CollectionList({ collections }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            sx={{
                py: 2,
                width: '100%',
                overflowX: 'auto'
            }}
        >
            <TableContainer component={Paper} elevation={3} sx={{ maxWidth: '100%' }}>
                <Table sx={{ minWidth: isMobile ? '600px' : '1000px' }}>
                    <ListHead />
                    <TableBody>
                        {collections.map((row, idx) => (
                            <Row
                                key={idx}
                                id={idx + 1}
                                item={row}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
