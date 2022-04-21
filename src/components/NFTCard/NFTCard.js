import { parsePinataNFT, parsePinataNFTUrl } from 'utils/pinata';
import { parseNFTUri } from 'utils/utils';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PINATA_GATEWAY } from 'utils/constants';
import { NFTCardProps } from 'types/types';
import Skeleton from '@mui/material/Skeleton';
import { Card, Link, Stack, CardContent, Divider, Box, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';


NFTCard.propTypes = NFTCardProps

export default function NFTCard({ nftoken }) {
  const { tid, uri } = nftoken;
  const [imgUrl, setImgUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const nft = parsePinataNFT(tid, uri);
  const [tokenURI, setTokenURI] = useState()
  // const [sellOffered, setSellOffered] = useState(false)

  // const getOffers = () => {
  //     getSellOffers(tid).then(res => {

  //         console.log('offers:', res)
  //     })
  //     // if(offers) setSellOffered(true)
  // }

  const getNFTMetadata = async () => {
    setLoading(true)

    let tokenURI = parseNFTUri(uri);
    setTokenURI(parseNFTUri(uri))
    if (tokenURI) {
      // console.log('tokenURI:', tokenURI.main)
      if (tokenURI.header === 'xrpnft.com') {
        try {
          const res = await axios.get(PINATA_GATEWAY + tokenURI.main)
          setImgUrl(PINATA_GATEWAY + res.data.fileUrl.slice(11))
        } catch (e) {
          console.log(e)
        }
      }
      if (tokenURI.header === 'common') setImgUrl(tokenURI.main)
    }
    setLoading(false)
  }

  useEffect(() => {
    // getOffers()
    getNFTMetadata()
  }, [])

  return (
    <Link href={`/offpage/${nftoken.tid}/${nftoken.uri}`} underline='none'>
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
          <Stack direction='row' alignItems='center' justifyContent='start' sx={{ fontSize: 20, gap: 2 }}>
            {nft.flags.tfBurnable && <Icon icon='ps:feedburner' />}
            {nft.flags.tfOnlyXRP && <Icon icon="teenyicons:ripple-solid" />}
            {nft.flags.tfTrustLine && <Icon icon='codicon:workspace-trusted' />}
            {nft.flags.tfTransferable && <Icon icon='mdi:transit-transfer' />}
            {nft.flags.tfNoFlag && <Icon icon='carbon:not-available' />}
          </Stack>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Icon icon="teenyicons:ripple-solid" />
            <Typography sx={{ color: 'lightblue' }}>3000</Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ alignItems: 'space-evenly' }}>
          <IconButton aria-label='buy'>
            <Icon icon="bxs:cart-alt" />
          </IconButton>
          <IconButton aria-label='share'>
            <FavoriteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Link>
  );
}
