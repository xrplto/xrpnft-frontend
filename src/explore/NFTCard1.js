import { useEffect, useState } from 'react';

// Material
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Divider,
    IconButton,
    Link,
    Skeleton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Iconify
import { Icon } from '@iconify/react';

// Components
import FlagsContainer from './Flags';
import PriceContainer from './Price';

// Utils
import { getNFTokenInfo } from 'src/utils/parse';

// import {getSellOffers} from 'src/utils/tokenActions'


export default function NFTCard({ Flags, Issuer, TokenID, URI }) {
    const [imgUrl, setImgUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(null)

    useEffect(() => {
        let mounted = true
        const getImgUrl = async () => {
            setLoading(true)
            console.log('uri:', URI)

            const res = await getNFTokenInfo(URI)
            
            if (mounted) {
                setImgUrl('/static/nft.png')
                // setImgUrl(res.image)
                console.log("image url", res.image)
            }
            setLoading(false)
            // if(res.description.name){
            // setName(res.description.name)}

        }

        getImgUrl()

        return () => {
            mounted = false
        }
    }, [URI])

    return (
        <Link href={`/nft/${TokenID}/${URI}`} underline='none'>
            <Card sx={{ width: 300 }}>
                {
                  !loading
                    ?
                    <CardMedia
                        component='img'
                        image={imgUrl}
                        // image='/static/cover.jpg'
                        alt={imgUrl}
                        sx={{ height: 300, width: 300 }}
                    />
                    :
                    <Skeleton animation='wave' variant='rectangular' width={300} height={300} />
                }
                <CardContent sx={{ padding: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                    <children >Collection</children>
                    <children >Price</children>
                </CardContent>
                <CardContent sx={{ padding: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                    <children >{name}</children>
                    <PriceContainer price="2000" />
                </CardContent>
                <Divider />
                <CardContent sx={{ padding: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                    <FlagsContainer Flags={Flags} />
                    {/* <IconButton aria-label='buy'> */}
                      {/* <Icon icon="bxs:cart-alt" /> */}
                    {/* </IconButton> */}
                    {/* <IconButton aria-label='share'> */}
                      <FavoriteIcon />
                    {/* </IconButton> */}
                </CardContent>
            </Card>
        </Link>
    );
}
