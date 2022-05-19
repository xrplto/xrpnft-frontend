import { useSelector } from 'react-redux'
import { Container, Grid, Typography } from "@mui/material";
import NFTCard from 'components/nftcard/NFTCard';
import { getTokens } from 'utils/tokenActions';
import useSWR from 'swr'
import PageError from 'pages/PageError';

export default function AccountNfts({nfts}) {




    return (
        <Container sx={{ marginTop: 2 }}>
            {
                <Grid container spacing={2} justifyContent='center'>
                    {
                        nfts.account_nfts.map((nft) => (
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
