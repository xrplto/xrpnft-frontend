import React from 'react';

// Material
import {
    Stack,
    Typography,
    styled,
    Container
} from '@mui/material';

// Utils
import { CollectionListType } from 'src/utils/constants';

// Components
import CollectionList from './CollectionList';

const GradientTypography = styled(Typography)(
    ({ theme }) => `
        background: linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        display: inline-block;
    `
);

export default function Collections() {
    return (
        <Container maxWidth="xl">
            <Stack spacing={1} sx={{ mt: 4, mb: 3 }}>
                <GradientTypography
                    variant="h2"
                    fontWeight="bold"
                    sx={{
                        fontSize: {
                            xs: '2rem',
                            sm: '2.5rem',
                            md: '3rem'
                        },
                        mb: 3
                    }}
                >
                    Explore Collections
                </GradientTypography>
                {/* <Typography variant="h2b">Discover the leading NFT collections on XRPNFT, ranked by metrics such as volume, floor price, and other key stats.</Typography> */}
            </Stack>
            
            <Stack sx={{mt: 5, minHeight: '50vh'}}>
                <CollectionList type={CollectionListType.ALL}/>
            </Stack>
        </Container>
    );
}
