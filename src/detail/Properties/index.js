// Material
import {
    Box,
    Container,
    Grid,
    Typography,
} from '@mui/material';

// Components
import Trait from './Trait';

/*
[
    {
        "trait_type": "Background",
        "value": "Sine Wave"
    },
    {
        "trait_type": "Skins",
        "value": "Camo"
    },
    {
        "trait_type": "Clothes",
        "value": "Runner Tanktop"
    },
    {
        "trait_type": "Necklace",
        "value": "Heart Pendant Necklace Blue"
    },
    {
        "trait_type": "Eyes",
        "value": "Happy Eyes"
    },
    {
        "trait_type": "Eyewear",
        "value": "None"
    },
    {
        "trait_type": "Headwear",
        "value": "None"
    },
    {
        "trait_type": "Earrings",
        "value": "Shell Earrings"
    },
    {
        "trait_type": "Mouth",
        "value": "White Teeth"
    }
]
*/

const gridItem = {
    margin: "8px",
    // border: "1px solid red"
};

// https://stackoverflow.com/questions/50743402/material-ui-grid-item-height
export default function Properties({ properties }) {
    return (
        <Container>
            <Grid container spacing={2}>
            {
                properties.map((item, idx) => (
                    <Box sx={gridItem} key={"Properties" + idx}>
                        <Trait type={item.type || item.trait_type} value={item.value} />
                    </Box>
                ))
            }
            </Grid>
        </Container>
    );
}
