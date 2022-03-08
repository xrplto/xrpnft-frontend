import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Card, Link, Typography, Stack, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fCurrency } from '../../utils/formatNumber';
//
import Label from '../../components/Label';
import ColorPreview from '../../components/ColorPreview';
const AddressCodec = require('ripple-address-codec');
const {BigNumber} = require('bignumber.js');

// ----------------------------------------------------------------------

const TokenImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
});

// ----------------------------------------------------------------------
function cipheredTaxon(tokenSeq, taxon) {
    // An issuer may issue several NFTs with the same taxon; to ensure that NFTs
    // are spread across multiple pages we lightly mix the taxon up by using the
    // sequence (which is not under the issuer's direct control) as the seed for
    // a simple linear congruential generator.
    //
    // From the Hull-Dobell theorem we know that f(x)=(m*x+c) mod n will yield a
    // permutation of [0, n) when n is a power of 2 if m is congruent to 1 mod 4
    // and c is odd.
    //
    // Here we use m = 384160001 and c = 2459. The modulo is implicit because we
    // use 2^32 for n and the arithmetic gives it to us for "free".
    //
    // Note that the scramble value we calculate is not cryptographically secure
    // but that's fine since all we're looking for is some dispersion.
    //
    // **IMPORTANT** Changing these numbers would be a breaking change requiring
    //               an amendment along with a way to distinguish token IDs that
    //               were generated with the old code.
    // tslint:disable-next-line:no-bitwise
    return taxon ^ (384160001 * tokenSeq + 2459);
}

function parseNftFlag(flags_number){
    var flags = {
      "tfBurnable": false,
      "tfOnlyXRP": false,
      "tfTrustLine": false,
      "tfTransferable": false
    };
    
    if ((flags_number & 0x00000001) !== 0) {
        flags["tfBurnable"] = true;
    }
    if ((flags_number & 0x00000002) >> 1 !== 0) {
        flags["tfOnlyXRP"] = true;
    }
    if ((flags_number & 0x00000004) >> 2 !== 0) {
        flags["tfTrustLine"] = true;
    }
    if ((flags_number & 0x00000008) >> 3 !== 0) {
        flags["tfTransferable"] = true;
    }    
    return flags;
}

/**
 * 000B 0C44 95F14B0E44F78A264E41713C64B5F89242540EE2 BC8B858E 00000D65
 * +--- +--- +--------------------------------------- +------- +-------
 * |    |    |                                        |        |
 * |    |    |                                        |        `---> Sequence: 3,429
 * |    |    |                                        |
 * |    |    |                                        `---> Taxon: 146,999,694
 * |    |    |
 * |    |    `---> Issuer: rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2
 * |    |
 * |    `---> TransferFee: 314.0 bps or 3.140%
 * |
 * `---> Flags: 11 -> lsfBurnable, lsfOnlyXRP and lsfTransferable
 */
 function parseNFT(tokenID, tokenURI) {
    if (typeof tokenID !== "string" || tokenID.length !== 64) {
        return null;
    }
  
    const flags = new BigNumber(tokenID.slice(0, 4), 16).toNumber();
    const transferFee = new BigNumber(tokenID.slice(4, 8), 16).toNumber();
    const issuer = AddressCodec.encodeAccountID(Buffer.from(tokenID.slice(8, 48), "hex"));
    const scrambledTaxon = new BigNumber(tokenID.slice(48, 56), 16).toNumber();
    const sequence = new BigNumber(tokenID.slice(56, 64), 16).toNumber();

    /*var flags = {
        "tfBurnable": false, // Issuer can destroy the object.
        "tfOnlyXRP": false,  // The tokens can only be offered or sold for XRP
        "tfTrustLine": false, // Issuer wants a trustline to be automatically created.
        "tfTransferable": false // Indicates that this NFT can be transferred.
    };*/
  
    return {
        issuer: issuer,
        flags: parseNftFlag(flags),
        tokenID: tokenID,
        tokenURI: tokenURI,
        transferFee: transferFee,
        tokenTaxon: cipheredTaxon(sequence, scrambledTaxon),
        sequence: sequence,
    };
}

NftCard.propTypes = {
    nftoken: PropTypes.object
};

export default function NftCard({ nftoken }) {
    const {tokenID, URI} = nftoken;
    //const nft = parseNFT(nftoken);
    //console.log(nft);
    return (
        <Card>
            <Box sx={{ pt: '100%', position: 'relative' }}>
            </Box>
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
