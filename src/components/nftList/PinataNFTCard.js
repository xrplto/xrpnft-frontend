import { parsePinataNFT, parsePinataNFTUrl } from 'utils/pinata';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PINATA_GATEWAY } from 'utils/constants';
import { PinataNFTCardProps } from 'types/types';
import Skeleton from '@mui/material/Skeleton';
import { Card, Link, Stack, CardContent, Divider } from '@mui/material';
import { Icon } from '@iconify/react';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

PinataNFTCard.propTypes = PinataNFTCardProps

export default function PinataNFTCard({ nftoken }) {
    const { tid, uri } = nftoken;
    const [imgUrl, setImgUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const nft = parsePinataNFT(tid, uri);

    const getNFTMetadata = async () => {
        setLoading(true)
        let metadataUrl = parsePinataNFTUrl(uri);
        if (metadataUrl.slice(0, 10) === 'xrpnft.com') metadataUrl = metadataUrl.slice(11)
        try {
            const res = await axios.get(PINATA_GATEWAY + metadataUrl)
            setImgUrl(PINATA_GATEWAY + res.data.fileUrl.slice(11))
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    useEffect(() => {

        getNFTMetadata()
    }, [])

    return (
        <Link href={`/offpage/${nftoken.tid}/${nftoken.uri}`} underline='none'>
            <Card >
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
                <CardContent>
                    <Stack direction='row' alignItems='center' justifyContent='space-around' sx={{ fontSize: 25 }}>
                        {nft.flags.tfBurnable && <Icon icon='ps:feedburner' />}
                        {nft.flags.tfOnlyXRP && <Icon icon='cryptocurrency:xrp' />}
                        {nft.flags.tfTrustLine && <Icon icon='codicon:workspace-trusted' />}
                        {nft.flags.tfTransferable && <Icon icon='mdi:transit-transfer' />}
                        {nft.flags.tfNoFlag && <Icon icon='carbon:not-available' />}
                    </Stack>
                </CardContent>
                <Divider />
                <CardActions >
                    <IconButton aria-label='add to favorites'>
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label='share'>
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </Link>
    );
}
