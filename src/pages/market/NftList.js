import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import NftCard from './NftCard';

// ----------------------------------------------------------------------

NftList.propTypes = {
    nfts: PropTypes.array.isRequired
};

export default function NftList({ nfts, ...other }) {
    return (
        <Grid container spacing={6} {...other} sx={{ p: 5 }}>
            {nfts.map((nftoken) => (
                <Grid key={nftoken.tokenID} item xs={12} sm={6} md={2.4}>
                    <NftCard nftoken={nftoken} />
                </Grid>
            ))}
        </Grid>
    );
}
