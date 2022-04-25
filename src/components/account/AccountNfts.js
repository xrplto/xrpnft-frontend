import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import axios from 'axios'
import { Grid, Backdrop } from "@mui/material";
import { BASE_URL, BASIC_COLOR } from "utils/constants";
import { FadeLoader } from 'react-spinners';
import NFTCard from 'components/NFTCard/NFTCard';

export default function AccountNfts() {
    const [loading, setLoading] = useState(false);
    const account = useSelector(state => state.account.account)
    const [userNfts, setUserNfts] = useState([])

    const fetchAccountNFTs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${BASE_URL}/account/nfts/${account.key}`)
            setUserNfts(res.data.nfts)
            console.log(res.data.nfts)
        } catch (e) {
            console.log('Error fetching account NFTs', e)
        }
        setLoading(false)
    };

    useEffect(() => {
        let mounted = true
        if (mounted)
            fetchAccountNFTs()
        return () => {
            mounted = false
        }
    }, [])
    return (
        <>
            <Backdrop
                sx={{ color: '#000', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <FadeLoader color={BASIC_COLOR} size={50} />
            </Backdrop>
            <p>This account has {userNfts.length} items</p>
            {
                userNfts.length > 0 && (
                    <Grid container spacing={2} justifyContent='center'>
                        {
                            userNfts.map((nft) => (
                                <Grid item
                                    key={nft.TokenID}
                                >
                                    <NFTCard nftoken={{ tid: nft.TokenID, uri: nft.URI }} key={nft.TokenID} />
                                </Grid>
                            ))
                        }
                    </Grid>
                )
            }
        </>
    );
}
