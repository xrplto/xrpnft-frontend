import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { setCurrenToken } from 'app/slices/nftsSlice';
// material
import { Box, Card, Link, Typography, Stack/*, Avatar*/ } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
//import { red, green, blue } from '@mui/material/colors';
import Label from '../Label';
//import ColorPreview from '../../components/ColorPreview';

// import {Icon} from '@mui/material'
import { Icon } from '@iconify/react';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpokeIcon from '@mui/icons-material/Spoke';

const nftParser = require('../../pages/market/NftParser');

const utils = require('../../utils');

// ----------------------------------------------------------------------
const TokenImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

NftCard.propTypes = {
    nftoken: PropTypes.object
};

export default function NftCard({ nftoken }) {
    const { tokenID, URI } = nftoken;
    const dispatch = useDispatch()
    // 000000000272ECED526CB9FB90275EC6196EC6C522CFFB938962EFA100000006
    // 6D796E34333433667420637573746F6D206461746120455652
    const nft = utils.parseNFT(tokenID, URI);
    const status = 'NEW';
    const name = nft.issuer;
    const navigate = useNavigate();
    let uri = nft.tokenURI;
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
    //nftParser.doParseNFT('r3iKY5HKD2JbWqprgMXgx1VMLNn4dza2We', '00080000561CBEA25BB4B971F35526D45B32A7F8E4B2D3D90000099B00000000');
    //nftParser.doParseNFT(nft.issuer, nft.tokenID);
    const handleNFTClick = () => {
        navigate(`/offpage/${nftoken.tokenID}?tokenURI=${nftoken.URI}`);
        dispatch(setCurrenToken(nftoken))
    }

    return (
        <Card onClick={handleNFTClick} sx={{
            borderRadius: 1,
            maxWidth: 300,
            '&:hover': {
                cursor: 'pointer'
            },
        }}>
            <Box sx={{ pt: '100%', position: 'relative' }}>
                {status && (
                    <Label
                        variant="filled"
                        color={(status === 'sale' && 'error') || 'info'}
                        sx={{
                            zIndex: 9,
                            top: 16,
                            right: 16,
                            position: 'absolute',
                            textTransform: 'uppercase'
                        }}
                    >
                        {status}
                    </Label>
                )}
                {!uri && (
                    <TokenImgStyle id={tokenID} alt={name} src={'/static/cover.jpg'} />
                )}
            </Box>

            <Stack spacing={2} sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-around">
                    {nft.flags.tfBurnable && (<LocalFireDepartmentIcon width="32" height="32" />)}
                    {nft.flags.tfOnlyXRP && (<SpokeIcon width="32" height="32" />)}
                    {nft.flags.tfTrustLine && (<VerifiedUserIcon width="32" height="32" />)}
                    {nft.flags.tfTransferable && (<TransferWithinAStationIcon width="32" height="32" />)}
                    {nft.flags.tfNoFlag && (<Box sx={{ mx: "auto", width: 32, height: 32 }} />)}
                    {/* <ColorPreview colors={[red,blue,green]} />
                    <Typography variant="subtitle1">
                        <Typography
                            component="span"
                            variant="body1"
                            sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through'
                            }}
                        >
                            {priceSale && fCurrency(priceSale)}
                        </Typography>
                        &nbsp;
                        {fCurrency(0)}
                    </Typography> */}
                </Stack>

                <Link to="#" color="inherit" underline="hover" component={RouterLink}>
                    <Typography variant="subtitle2" noWrap>
                        {name}
                    </Typography>
                </Link>
            </Stack>
        </Card>
    );
}

// export default function NftCard({ nft }) {
//     const { name, cover, price, colors, status, priceSale } = nft;
//     return (
//         <Card>
//             <Box sx={{ pt: '100%', position: 'relative' }}>
//                 {status && (
//                     <Label
//                       variant="filled"
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
//                 <Link to="#" color="inherit" underline="hover" component={RouterLink}>
//                     <Typography variant="subtitle2" noWrap>
//                       {name}
//                     </Typography>
//                 </Link>

//                 <Stack direction="row" alignItems="center" justifyContent="space-between">
//                     <ColorPreview colors={colors} />
//                     <Typography variant="subtitle1">
//                         <Typography
//                             component="span"
//                             variant="body1"
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
