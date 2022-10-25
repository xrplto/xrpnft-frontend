// Material
import {
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

export default function Properties({ properties }) {
    return (
        <Container>
        {
            properties ? (
                <Grid container spacing={2}>
                {
                    properties.map((property) => (
                        <Grid item key={property.id}>
                            <Trait type={property.type} value={property.value} />
                        </Grid>
                    ))
                }
                </Grid>
        </Container>
    );
}
