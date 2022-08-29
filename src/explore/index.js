import axios from 'axios'
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// Material
import {
    Grid
} from "@mui/material";

// Redux
import { useSelector } from 'react-redux'

// Components
import NFTCard from './NFTCard';
// import { getNFTokenInfo } from 'utils/utils';

// import getNFTimage_info from 'components/NFTCard/NFTimage_info'

export default function ExploreNFT({data}) {
    const BASE_URL = 'https://api.xrpnft.com/api'

    const { enqueueSnackbar } = useSnackbar();
    const [nfTokens, setNfTokens] = useState(data.nfts);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [flag, setFlag] = useState(0);

    const fetchImages = (nfTokensParam, offsetParam) => {
        const _nfTokens = nfTokensParam ? nfTokensParam : nfTokens
        const _offset = offsetParam === 0 ? offsetParam : offset
        axios
            .get(`${BASE_URL}/nfts?page=${_offset}&limit=30&flag=${flag}&status=3&self=false`)
            .then(res => {
                if (res.data.nfts.length < 10) {
                    setHasMore(false)
                }
                 
                setNfTokens([..._nfTokens, ...res.data.nfts])
                // enqueueSnackbar('Fetch:' + _offset, {
                //     variant: 'success'
                // })
                setOffset(_offset + 1)
            });
    };

    // const fetchNFTokens = async () => {
    //     try {
    //         // const res = await axios.get(`${BASE_URL}/nfts/${offset}`)
    //         const res = await axios.get(`${BASE_URL}/nfts?page=${offset}&limit=20&flag=${flags}`)
    //         // setIsLoaded(true);
    //         if (res.data.nfts.length < 10) // if this is the last page, no more request to server
    //             setHasMore(false)
    //         dispatch(addNfts(res.data.nfts))
    //         dispatch(increaseOffset())
    //         openSnackbar('Fetch:' + offset, 'success')
    //     } catch (e) {
    //         // use snack bar here
    //         openSnackbar(e.message, 'error')
    //     }
    // }

    const reset = () => {
        setNfTokens([])
        setOffset(0)
        fetchImages([], 0)
    }

    useEffect(() => {
        reset()
        setHasMore(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flag]);

    return (
        <InfiniteScroll
            dataLength={nfTokens.length}
            next={() => fetchImages()}
            hasMore={hasMore}
            // loader={<p>loading...</p>}
        >   
        
            <Grid container spacing={2}
                style={{
                    display: 'grid',
                    justifyContent: 'center',
                    alignContent: 'flex-start',
                    gridGap: '50px',
                    gridTemplateColumns: 'repeat(auto-fill, 300px)',
                    marginTop: '30px'
                }}
            >
                {   
                
                    nfTokens.map((nft) => (
                        
                        // <Grid item key={nft.TokenID}
                        // >
                            <NFTCard
                                key={nft.TokenID}
                                nft={nft}
                            />
                        //  </Grid>
                    ))
                    
                    // .filter(getNFTimage_info(URI)!==null)      
                }
            </Grid>
        </InfiniteScroll>
    );
};
