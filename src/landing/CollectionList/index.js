// Material
import { Box, Table, TableBody, useMediaQuery, useTheme } from '@mui/material';

// Components
import Row from './Row';
import ListHead from './ListHead';

export default function CollectionList({ collections }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    py: 1,
                    overflow: 'auto',
                    width: '100%',
                    '& > *': {
                        scrollSnapAlign: 'center'
                    },
                    '::-webkit-scrollbar': { display: 'none' }
                }}
            >
                <Table style={{ minWidth: isMobile ? undefined : '1000px' }}>
                    <ListHead />
                    <TableBody>
                        {collections.map((row, idx) => (
                            <Row key={idx} id={idx + 1} item={row} />
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}
