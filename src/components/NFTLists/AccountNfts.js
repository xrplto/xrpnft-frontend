import { useSelector } from 'react-redux'
import { Container, Grid, Typography } from "@mui/material";
import NFTCard from 'components/NFTCard/NFTCard';
import { getTokens } from 'utils/tokenActions';
import useSWR from 'swr'

export default function AccountNfts() {
    const account = useSelector(state => state.account.account)
    const { data, error } = useSWR(account.key, getTokens)


    if (error) return <Typography variant='body1'>Failed to load: {error}</Typography>
    if (!data) return <Typography variant='body1'>Loading...</Typography>
    return (
        <Container sx={{ marginTop: 2 }}>
            {
                <Grid container spacing={2} justifyContent='center'>
                    {
                        data.account_nfts.map((nft) => (
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
                        // Flags: 14
                        // Issuer: "rahPAzF2znC1iHPzeXQBUNJGeh2Yhj59N5"
                        // NFTokenID: "000E0000377D0873B7552D8C9CEFA06D50287F7F33EBA51A0000099B00000000"
                        // NFTokenTaxon: 0
                        // URI: "7872706E66742E636F6D2F697066732F516D5439706B6B46387642716941315144595173485A726B50526E44744C64523133437A5A7670715A7A58507076"
                        // nft_serial: 0
                    }
                </Grid>
            }
        </Container>
    );
}
