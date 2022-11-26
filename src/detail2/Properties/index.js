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

// Fixed number of columns
const gridContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)"
};

// Variable number of columns
const gridContainer2 = {
    display: "grid",
    gridAutoColumns: "1fr",
    gridAutoFlow: "column"
};

const gridItem = {
    margin: "8px",
    // border: "1px solid red"
};

// https://stackoverflow.com/questions/50743402/material-ui-grid-item-height
export default function Properties({ properties, total }) {
    return (
        <Container>
            <Grid container spacing={2}>
            {
                properties.map((item, idx) => (
                    <Box sx={gridItem} key={"Properties" + idx}>
                        <Trait prop={item} total={total || 0} />
                    </Box>
                ))
            }
            </Grid>

            {/* <Grid container columnSpacing={1} 
                // justifyContent='center'
                alignItems='center'
            >
            {
                properties.map((item, idx) => (
                    <Grid item md={3} xs={6} key={"Properties" + idx}>
                        <Trait type={item.type || item.trait_type} value={item.value} />
                    </Grid>
                ))
            }
            </Grid> */}
        </Container>
    );
}
