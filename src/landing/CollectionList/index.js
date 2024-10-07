import React, { useState } from 'react';
import { Table, TableBody, TableContainer, Button, Box } from '@mui/material';
import Row from './Row';
import ListHead from './ListHead';

export default function CollectionList({ collections }) {
    const [visibleRows, setVisibleRows] = useState(5);
    const [allVisible, setAllVisible] = useState(false);

    const handleViewMore = () => {
        if (visibleRows + 5 >= collections.length) {
            setVisibleRows(collections.length);
            setAllVisible(true);
        } else {
            setVisibleRows((prevVisibleRows) => prevVisibleRows + 5);
        }
    };

    const handleViewAll = () => {
        window.location.href = '/collections';
    };

    return (
        <TableContainer
            sx={{
                width: '100%',
                maxWidth: 1400,
                margin: '0 auto',
                border: '1px solid white',
                borderRadius: '16px', // Increased border radius for more rounded corners
                overflow: 'hidden', // This ensures the table content doesn't overflow the rounded corners
            }}
        >
            <Table>
                <ListHead />
                <TableBody>
                    {collections
                        .slice(0, visibleRows)
                        .map((collection, index) => (
                            <Row
                                key={collection.uuid}
                                id={index + 1}
                                item={collection}
                            />
                        ))}
                </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                {allVisible ? (
                    <Button onClick={handleViewAll} variant="outlined">
                        View All Collections
                    </Button>
                ) : visibleRows < collections.length ? (
                    <Button onClick={handleViewMore} variant="outlined">
                        View More
                    </Button>
                ) : null}
            </Box>
        </TableContainer>
    );
}
