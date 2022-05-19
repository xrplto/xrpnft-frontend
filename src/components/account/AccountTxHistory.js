import { Container, Grid, Typography } from "@mui/material";
import useSWR from 'swr'
import PageError from 'pages/PageError';
import { getAccountTxHistory } from 'utils/tokenActions';

export default function AccountTxHistory({ txHistory }) {

    return (
        <Container sx={{ marginTop: 2 }}>
            {
                <Grid container spacing={2} justifyContent='center'>
                    {
                        // data.map((tx, i) => (
                        //     <Grid item key={i}
                        //     >
                                JSON.stringify(txHistory)
                        //     </Grid>
                        // ))
                    }
                </Grid>
            }
        </Container>
    );
}
