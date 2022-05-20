import { useSelector, useState, useEffect } from 'react'
import { Container, Grid, Typography } from "@mui/material";
import NFTCard from 'components/nftcard/NFTCard';
import { getTokens } from 'utils/tokenActions';
import useSWR from 'swr'
import PageError from 'pages/PageError';

export default function AccountNfts({ account }) {
    const [nfts, setNFTs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const nfts_result = await getTokens(account)
                setNFTs(nfts_result.account_nfts)
            } catch (e) {
                console.log(e)
            }
            setLoading(false)
        }

        fetchData()
    }, [account])
    return (
        loading ? <Typography variant="caption">Loading...</Typography> :
            nfts && <Container sx={{ marginTop: 2 }}>
                {
                    <Grid container spacing={2} justifyContent='center'>
                        {
                            nfts.map((nft) => (
                                <Grid item
                                    key={nft.NFTokenID}
                                >
                                    <NFTCard
                                        Flags={nft.Flags}
                                        Issuer={nft.Issuer}
                                        URI={nft.URI}
                                        NFTokenID={nft.NFTokenID}
                                    />
                                </Grid>
                            ))
                        }
                    </Grid>
                }
            </Container>
    );
}
