import {
    Paper,
    Typography,
} from '@mui/material';

export default function Trait({ trait }) {
    const type = trait.type || trait.trait_type;
    const value = trait.value;

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
        </Paper>
    );
}
