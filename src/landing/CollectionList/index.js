import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableContainer,
    Button,
    Box,
    useTheme,
    alpha,
    useMediaQuery
} from '@mui/material';
import Row from './Row';
import ListHead from './ListHead';

export default function CollectionList({ collections }) {
    const [visibleRows, setVisibleRows] = useState(5);
    const [allVisible, setAllVisible] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                maxWidth: isMobile ? '100%' : '80%', // Full width on mobile
                margin: '0 auto',
                borderRadius: theme.shape.borderRadius * 0.1,
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                background: alpha(theme.palette.background.paper, 0.15),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                boxShadow: `0 8px 32px 0 ${alpha(
                    theme.palette.primary.main,
                    0.2
                )}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: `0 12px 48px 0 ${alpha(
                        theme.palette.primary.main,
                        0.3
                    )}`,
                    background: alpha(theme.palette.background.paper, 0.2),
                    outline: `2px solid ${alpha(
                        theme.palette.primary.main,
                        0.5
                    )}`,
                    outlineOffset: '2px'
                },
                padding: 0,
            }}
        >
            <Table 
                size="small" 
                sx={{ 
                    '& td, & th': { 
                        py: 1,
                        px: isMobile ? 1 : 2, // Reduce horizontal padding on mobile
                    } 
                }}
            >
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
            <Box
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    py: 0.5, // Reduced vertical padding
                }}
            >
                {allVisible ? (
                    <Button
                        onClick={handleViewAll}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minHeight: '24px', py: 0.5 }} // Reduce button height
                    >
                        View All Collections
                    </Button>
                ) : visibleRows < collections.length ? (
                    <Button
                        onClick={handleViewMore}
                        variant="outlined"
                        color="primary"
                        size="small"
                        sx={{ minHeight: '24px', py: 0.5 }} // Reduce button height
                    >
                        View More
                    </Button>
                ) : null}
            </Box>
        </TableContainer>
    );
}
