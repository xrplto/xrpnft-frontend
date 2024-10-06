import Decimal from 'decimal.js';

import {
    Paper,
    Stack,
    Typography,
    Tooltip,
} from '@mui/material';

export default function Trait({ prop, total }) {
    const type = prop.type || prop.trait_type;
    const value = prop.value;
    const count = prop.count || 0;

    let rarity = 0;
    if (total > 0 && count > 0)
        rarity = new Decimal(count).mul(100).div(total).toDP(2, Decimal.ROUND_DOWN).toNumber();

    const tooltipTitle = total > 0 ? `${count} out of ${total} have this trait` : 'Rarity data not available';

    return (
        <Tooltip title={tooltipTitle} arrow>
            <Paper
                sx={{
                    width: '100%',
                    height: "100%",
                    borderRadius: '8px',
                    border: '1px solid #1e90ff',
                    padding: 1,
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, #1e90ff10, #1e90ff20)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(30, 144, 255, 0.3)',
                        background: 'linear-gradient(145deg, #1e90ff20, #1e90ff30)',
                    },
                }}
            >
                <Stack spacing={0.25}>
                    <Typography sx={{ 
                        overflowWrap: 'break-word', 
                        textTransform: 'uppercase', 
                        color: '#1e90ff', 
                        fontWeight: 700, 
                        fontSize: 10,
                        letterSpacing: 0.5,
                    }}>
                        {type}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#333', fontSize: 14 }}>
                        {value}
                    </Typography>
                    {total > 0 && (
                        <Typography sx={{ fontSize: 10, color: '#666' }}>
                            {rarity}%
                        </Typography>
                    )}
                </Stack>
            </Paper>
        </Tooltip>
    );
}
