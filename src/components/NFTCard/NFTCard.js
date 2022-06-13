import { useEffect, useState } from 'react';
import { NFTCardProps } from 'utils/types';
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
import { Icon } from '@iconify/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FlagsContainer from './Flags';
import { getNFTokenInfo } from 'utils/utils';
import PriceContainer from './Price';
import {getSellOffers} from 'utils/tokenActions'


NFTCard.propTypes = NFTCardProps

export default function NFTCard({
  Flags,
  Issuer,
  NFTokenID,
  URI,
}) {
  const [imgUrl, setImgUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(null)
  const [price, setPrice] = useState('0')
  // const [sellprice, setSellprice] = useState('')


  useEffect(() => {
    let mounted = true
    // const getName = async() =>{
    //   const res=await getNFTokenInfo(URI)
    // }
    const getImgUrl = async () => {
      setLoading(true)
      console.log('uri:', URI)

      const res = await getNFTokenInfo(URI)
      
      if (mounted)
        {setImgUrl(res.image)
        console.log("image url", res.image)
        
      }
      setLoading(false)
      if(res.description.name){
      setName(res.description.name)}

    }
    const getPrice = async() =>{
      const offers = await getSellOffers(NFTokenID)
      if(offers.length)
         {offers.map((offer) => (
         
          price<(offer.amount /(10**6))?
           setPrice(offer.amount / (10 ** 6))
           :price=0? setPrice(offer.amount / (10 ** 6)):console.log('No selloffer')
         ))

        }
    }
    getImgUrl()
    getPrice()

    return () => {
      mounted = false
    }
  }, [URI])

  return (
    imgUrl ?
    <Link href={`/nft/${NFTokenID}/${URI}`} underline='none'>
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
          <PriceContainer price={price} />
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
    : null
  );
}
