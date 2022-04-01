import { useSelector } from 'react-redux'
import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import axios from 'axios'
import { Grid } from "@mui/material";
import NftCard from "components/nftList/NftCard";
import { BASE_URL } from "utils/constants";
import PinataNFTCard from 'components/nftList/PinataNFTCard';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function AccountNfts() {
    const [loading, setLoading] = useState(false);
    const token = useParams()
    const account = useSelector(state => state.account.account)
    const [userNfts, setUserNfts] = useState([])

    const fetchAccountNFTs = () => {
        axios
            .get(`${BASE_URL}/account/nfts/${account.key}`)
            .then(res => {
                setUserNfts(res.data.nfts)
            });
    };

    useEffect(() => {
        fetchAccountNFTs()
    }, [account])
    return (
        <>
            <DrawerHeader />
            <p>This account has {userNfts.length} items</p>
            {
                userNfts.length > 0 && (
                    <Grid container spacing={1}>
                        {
                            userNfts.map((nft) => (
                                <Grid item xs={12} sm={6} md={3} lg={3}
                                    key={nft.TokenID}
                                >
                                    <PinataNFTCard nftoken={{ tokenID: nft.TokenID, URI: nft.URI }} key={nft.TokenID} />
                                </Grid>
                            ))
                        }
                    </Grid>
                )
            }
        </>
    );
}
