import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import NFTCard from 'components/NFTCard/NFTCard';
import { getTokens } from 'utils/tokenActions';

export default function AccountNfts() {
    const [loading, setLoading] = useState(false);
    const account = useSelector(state => state.account.account)
    const [userNfts, setUserNfts] = useState([])


    useEffect(() => {
        let mounted = true

        const getAccountNFTs = async () => {
            setLoading(true)
            const res = await getTokens(account.key)
            if (mounted)
                setUserNfts(res?.result.account_nfts)
            setLoading(false)
        }
        getAccountNFTs()
        return () => {
            mounted = false
        }
    }, [account.key])
    return (
        <>
            {
                loading ?
                    <Typography>
                        Loading...
                    </Typography>
                    : <Typography>This account has {userNfts.length} items</Typography>
            }
            {
                userNfts && (
                    <Grid container spacing={2} justifyContent='center'>
                        {
                            userNfts.map((nft) => (
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
                )
            }
        </>
    );
}
