import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { Card, Link, Stack, CardContent, Divider} from '@mui/material';
import { Icon } from '@iconify/react';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';

const utils = require('../../utils/utils');

NftCard.propTypes = {
    nftoken: PropTypes.object
};

export default function NftCard({ nftoken }) {
    const { tokenID, URI } = nftoken;
    const nft = utils.parseNFT(tokenID, URI);
    let uri = nft?.tokenURI;
    let url = null;
    if (uri) {
        if (uri.https) {
            url = 'https:' + uri.https;
        } else if (uri.ipfs) {
            url = 'https://ipfs.io/ipfs/' + uri.ipfs.replaceAll('//', '');
        } else if (uri.cid) {
            //console.log(uri);
        }
    }
    if (url) {
        //console.log(url);
    }

    return (
        <Link href={`/offpage/${nftoken.tokenID}/${nftoken.URI}`} underline="none">
            <Card >
                {
                    uri ?
                        <CardMedia
                            component='img'
                            // image={uri}
                            image='/static/cover.jpg'
                            alt='nft-image'
                            sx={{ height: 300, width: 300 }}
                        /> :
                        <Skeleton animation='wave' variant='rectangular' width={300} height={300} />
                }
                <CardContent>
                    <Stack direction='row' alignItems='center' justifyContent='space-around' sx={{ fontSize: 25 }}>
                        {nft.flags.tfBurnable && <Icon icon="ps:feedburner" />}
                        {nft.flags.tfOnlyXRP && <Icon icon="cryptocurrency:xrp" />}
                        {nft.flags.tfTrustLine && <Icon icon="codicon:workspace-trusted" />}
                        {nft.flags.tfTransferable && <Icon icon="mdi:transit-transfer" />}
                        {nft.flags.tfNoFlag && <Icon icon="carbon:not-available" />}
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
        // <Card onClick={handleNFTClick} sx={{
        //     borderRadius: 1,
        //     maxWidth: 300,
        //     '&:hover': {
        //         cursor: 'pointer'
        //     },
        // }}>
        //     <Box sx={{ pt: '100%', position: 'relative' }}>
        //         {status && (
        //             <Label
        //                 variant='filled'
        //                 color={(status === 'sale' && 'error') || 'info'}
        //                 sx={{
        //                     zIndex: 9,
        //                     top: 16,
        //                     right: 16,
        //                     position: 'absolute',
        //                     textTransform: 'uppercase'
        //                 }}
        //             >
        //                 {status}
        //             </Label>
        //         )}
        //         {!uri && (
        //             <Skeleton animation='wave' variant='rectangular'  width={250} height='100%' />
        //         )}
        //     </Box>

        //     <Stack spacing={2} sx={{ p: 3 }}>
        //         <Stack direction='row' alignItems='center' justifyContent='space-around'>
        //             {nft.flags.tfBurnable && (<LocalFireDepartmentIcon width='32' height='32' />)}
        //             {nft.flags.tfOnlyXRP && (<SpokeIcon width='32' height='32' />)}
        //             {nft.flags.tfTrustLine && (<VerifiedUserIcon width='32' height='32' />)}
        //             {nft.flags.tfTransferable && (<TransferWithinAStationIcon width='32' height='32' />)}
        //             {nft.flags.tfNoFlag && (<Box sx={{ mx: 'auto', width: 32, height: 32 }} />)}
        //         </Stack>

        //         {/* <Link to='#' color='inherit' underline='hover' component={RouterLink}>
        //             <Typography variant='subtitle2' noWrap>
        //                 {name?name:'Unknown'}
        //             </Typography>
        //         </Link> */}
        //     </Stack>
        // </Card>
    );
}

// export default function NftCard({ nft }) {
//     const { name, cover, price, colors, status, priceSale } = nft;
//     return (
//         <Card>
//             <Box sx={{ pt: '100%', position: 'relative' }}>
//                 {status && (
//                     <Label
//                       variant='filled'
//                       color={(status === 'sale' && 'error') || 'info'}
//                       sx={{
//                         zIndex: 9,
//                         top: 16,
//                         right: 16,
//                         position: 'absolute',
//                         textTransform: 'uppercase'
//                       }}
//                     >
//                         {status}
//                     </Label>
//                 )}
//                 <TokenImgStyle alt={name} src={cover} />
//             </Box>

//             <Stack spacing={2} sx={{ p: 3 }}>
//                 <Link to='#' color='inherit' underline='hover' component={RouterLink}>
//                     <Typography variant='subtitle2' noWrap>
//                       {name}
//                     </Typography>
//                 </Link>

//                 <Stack direction='row' alignItems='center' justifyContent='space-between'>
//                     <ColorPreview colors={colors} />
//                     <Typography variant='subtitle1'>
//                         <Typography
//                             component='span'
//                             variant='body1'
//                             sx={{
//                                 color: 'text.disabled',
//                                 textDecoration: 'line-through'
//                             }}
//                         >
//                             {priceSale && fCurrency(priceSale)}
//                         </Typography>
//                         &nbsp;
//                         {fCurrency(price)}
//                     </Typography>
//                 </Stack>
//             </Stack>
//         </Card>
//     );
// }
