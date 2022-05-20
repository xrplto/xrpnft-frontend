import { useEffect, useState } from 'react'
import { Container, Grid, Typography } from "@mui/material";
import useSWR from 'swr'
import PageError from 'pages/PageError';
import { getAccountTxHistory } from 'utils/tokenActions';

export default function AccountTxHistory({ account }) {
    const [txs, setTxs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const txs_result = await getAccountTxHistory(account)
                setTxs(txs_result)
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
        }

        fetchData()
    }, [account])
    return (
        loading ? <Typography variant='caption'>Loading...</Typography> :
            txs.length && <Container sx={{ marginTop: 2 }}>
                {
                    <Grid container spacing={2} justifyContent='center'>
                        {
                            // data.map((tx, i) => (
                            //     <Grid item key={i}
                            //     >
                            JSON.stringify(txs)
                            //     </Grid>
                            // ))
                        }
                    </Grid>
                }
            </Container>
    );
}
