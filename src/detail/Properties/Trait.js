import Decimal from 'decimal.js';

import {
    Paper,
    Typography,
} from '@mui/material';

export default function Trait({ prop, total }) {
    const type = prop.type || prop.trait_type;
    const value = prop.value;
    const count = prop.count || 0;

    let rarity = 0;
    if (total > 0 && count > 0)
        rarity = new Decimal(count).mul(100).div(total).toDP(2, Decimal.ROUND_DOWN).toNumber();

    return (
        <Paper
            sx={{
                width: '100%',
                // width: 91,
                // maxWidth
                height: "100%",
                borderRadius: '6px',
                border: '1px solid #00ff7f',
                padding: 1,
                // margin: 1,
                textAlign: 'center',
                background: '#00ff7f10'
            }}
        >
            <Typography sx={{ overflowWrap: 'break-word', textTransform: 'uppercase', color: 'springgreen', fontWeight: 500, fontSize: 11 }}>
                {type}
            </Typography>
            <Typography variant='s8'>
                {value}
            </Typography>
            {total > 0 &&
                <Typography variant="p3" sx={{ mt: 1, overflowWrap: 'break-word'}}>{count} ({rarity}%)</Typography>
            }
        </Paper>
    );
}
