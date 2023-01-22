import axios from 'axios';
import numeral from 'numeral';
import { replace } from 'lodash';
import { format, formatDistanceToNow } from 'date-fns';
import { encodeAccountID } from 'ripple-address-codec';
import isIPFS from 'is-ipfs';
import Decimal from 'decimal.js';
import hashicon from 'hashicon';
import { createCanvas } from 'canvas';

// ----------------------------------------------------------------------
function extractUrisFromString(uris_string) {
    var uris_obj = {};
    try {
        const uri_lines = uris_string.match(/[^\r\n]+/g);
        if (!uri_lines) return uris_obj;
        for (let i = 0; i < uri_lines.length; i++) { //for each line of the URI
            let uri_line = uri_lines[i];
            let uri_fieldname_length = uri_line.indexOf(':'); //match the first ':'
            if (uri_fieldname_length < 1) {
                continue;
            }
            uris_obj[uri_line.substring(0, uri_fieldname_length)] = uri_line.substring(uri_fieldname_length + 1, uri_line.length);
        }
    } catch (err) {
    }
    return uris_obj;
}


export function parseURI(nftoken_uri_hex) {
    if (!nftoken_uri_hex) return null;

    var uris_obj = {};
    var remaining_nftoken_uri_hex = nftoken_uri_hex;

    try {
        while (remaining_nftoken_uri_hex.length > 0) {
            if (remaining_nftoken_uri_hex.startsWith(convertStringToHex("0x"))) { //if the next field is hex_formatted
                let first_colon_index = remaining_nftoken_uri_hex.indexOf(convertStringToHex(':'));
                let key_hex = remaining_nftoken_uri_hex.substring(0, first_colon_index);
                let key = convertHexToString(key_hex);

                let remaining_key = key.substring(2, key.length);
                let first_key_underscore_index = remaining_key.indexOf('_');
                let value_length = Number(remaining_key.substring(0, first_key_underscore_index));
                if (isNaN(value_length) || value_length < 0) {
                    throw new Error("Malformed URI");
                }

                let value = remaining_nftoken_uri_hex.substring(first_colon_index + 2, first_colon_index + 2 + value_length);

                uris_obj[key] = value;
                remaining_nftoken_uri_hex = remaining_nftoken_uri_hex.substring(
                    first_colon_index + 2 + value_length + 2,
                    remaining_nftoken_uri_hex.length
                );
            } else { //if the next field is not hex_formatted
                let first_endline_index = remaining_nftoken_uri_hex.indexOf("0A");
                if (first_endline_index < 0) {
                    first_endline_index = remaining_nftoken_uri_hex.length;
                }

                let pair_hex = remaining_nftoken_uri_hex.substring(0, first_endline_index);

                let pair = convertHexToString(pair_hex);

                let extracted_uris = extractUrisFromString(pair);
                uris_obj = {
                    ...uris_obj,
                    ...extracted_uris
                };

                remaining_nftoken_uri_hex = remaining_nftoken_uri_hex.substring(
                    (first_endline_index === remaining_nftoken_uri_hex.length ?
                        first_endline_index :
                        first_endline_index + 2),
                    remaining_nftoken_uri_hex.length
                );
            }
        }
    } catch (err) {

    }
    if (isObjectEmpty(uris_obj))
        uris_obj = null;
    return uris_obj;
}

export const getdataFromjosn = async (tokenURI) => {
    const data = await axios.get(tokenURI)
    return (data)
}

export const getResponseType = (res) => {
    return res.headers['content-type']
}

const convertToHttpLink = (uriString) => {
    const regex_uri = /^[a-z0-9:./]+$/i

    if (regex_uri.test(uriString) && uriString.length > 45) {
        if (uriString.slice(0, 10) === 'xrpnft.com') // the tokenURI minted from this site
            return 'https://gateway.xrpnft.com/ipfs/' + uriString.slice(16)
        else if (uriString === 'cid:QmRxrbqTqK8Y6GN3NojSFdteihWeFA7fgDHQ1imfmhDPTA' || uriString === 'cid:QmPZrV3Vzoiuan2tLjkxUxwEGsg6ZLg8WwsPCvDRoEyBkS' || uriString === 'cid:QmbkgGS15BN1bi6Fv1MniMgkRBqQs5XPX4RS2STEfsHTqj') {
            return null
        }
        else if (uriString.slice(0, 5) === 'https') {
            return uriString.replace('infura.', '')
        }
        else if (uriString.slice(0, 4) === 'cid:') {
            return process.env.REACT_APP_IFPS_GATEWAY + uriString.slice(4)
        }
        else if (uriString.slice(0, 7) === 'ipfs://') {
            // if (uriString.slice(8,15) === 'bafybei') {
            //     return null
            // }
            return process.env.REACT_APP_IFPS_GATEWAY + uriString.slice(7)
        }
        else if (uriString.slice(0, 2) === 'Qm' || uriString.slice(0, 2) === 'ba') {
            return process.env.REACT_APP_IFPS_GATEWAY + uriString
        }
        else {
            console.log(uriString)
            return uriString
        }
    } else {
        return null
    }
}

export const parseNFTUri = (tokenURI) => {
    const regex_hex = /^[a-z0-9]+$/i
    if (!tokenURI) return null
    if (regex_hex.test(tokenURI)) {
        const uriString = convertHexToString(tokenURI)
        // console.log(`URI: ${uriString}`);
        return convertToHttpLink(uriString)
    }
    else return null
}

export const getImgUrlFromJSONResponse = (_param) => {
    const uri = _param.fileUrl
        ? _param.fileUrl
        : _param.content
            ? _param.content
            : _param.image
    return convertToHttpLink(uri)
}

export const GetImgUrlFromHTMLResponse = (res, tokenuri) => {
    const metadata = tokenuri + "/metadata.json"
    const imageurl = tokenuri + "/data.jpeg"
    // const text = convert(res,{
    //     wordwrap:130
    // })
    // const [imageurl, setImageurl] = useState("")
    // try{
    //     if(text.jpeg){
    //         // const image = tokenuri + "/data.jpeg"
    //     setImageurl(tokenuri + "/data.jpeg")
    //     }
    //     else if(text.png ){
    //     // const image = tokenuri + "/data.png"
    //     setImageurl(tokenuri + "/data.png")
    //     }
    //     console.log("html imgurl:", imageurl)
    // }
    // catch(e){
    // }
    // if(!image){
    //     const image =tokenuri + "/data.png"
    // }
    return (
        {
            image: imageurl,
            metadata: metadata
        }
    )
}
// ----------------------------------------------------------------------
export function cipheredTaxon(tokenSeq, taxon) {
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

export function parseNFTokenID(NFTokenID) {
    //   A   B                      C                        D        E
    // 0008 1388 2177B00DF84CA4B8DD59778594F472EF0F56E435 99AE2184 00000DEA
    if (!NFTokenID || NFTokenID.length !== 64) return { flag: 0, royalty: 0, issuer: '', taxon: 0 };
    const flag = new Decimal('0x' + NFTokenID.slice(0, 4)).toNumber();
    const royalty = new Decimal('0x' + NFTokenID.slice(4, 8)).toNumber();
    const issuer = encodeAccountID(Buffer.from(NFTokenID.slice(8, 48), "hex"));
    const scrambledTaxon = new Decimal('0x' + NFTokenID.slice(48, 56)).toNumber();
    const tokenSeq = new Decimal('0x' + NFTokenID.slice(56, 64)).toNumber();

    const taxon = cipheredTaxon(tokenSeq, scrambledTaxon);

    let transferFee = 0;
    try {
        if (royalty)
            transferFee = Decimal.div(royalty, '1000').toDP(3, Decimal.ROUND_DOWN).toNumber();
    } catch (e) { }

    return { flag, royalty, issuer, taxon, transferFee };
}

export function parseNftFlag(flags_number) {
    var flags = {
        "tfBurnable": false,
        "tfOnlyXRP": false,
        "tfTrustLine": false,
        "tfTransferable": false,
        "tfNoFlag": false
    };
    var noFlag = true;
    if ((flags_number & 0x00000001) !== 0) {
        flags["tfBurnable"] = true;
        noFlag = false;
    }
    if ((flags_number & 0x00000002) >> 1 !== 0) {
        flags["tfOnlyXRP"] = true;
        noFlag = false;
    }
    if ((flags_number & 0x00000004) >> 2 !== 0) {
        flags["tfTrustLine"] = true;
        noFlag = false;
    }
    if ((flags_number & 0x00000008) >> 3 !== 0) {
        flags["tfTransferable"] = true;
        noFlag = false;
    }
    flags.tfNoFlag = noFlag;
    return flags;
}

/**
 * Converts a string to its hex equivalent. Useful for Memos.
 *
 * @param string - The string to convert to Hex.
 * @returns The Hex equivalent of the string.
 * @category Utilities
 */
export function convertStringToHex(string) {
    let ret = '';
    try {
        ret = Buffer.from(string, 'utf8').toString('hex').toUpperCase();
    } catch (err) {
    }
    return ret;
}

/**
 * Converts hex to its string equivalent. Useful to read the Domain field and some Memos.
 *
 * @param hex - The hex to convert to a string.
 * @param encoding - The encoding to use. Defaults to 'utf8' (UTF-8). 'ascii' is also allowed.
 * @returns The converted string.
 * @category Utilities
 */
export function convertHexToString(hex, encoding = 'utf8') {
    let ret = '';
    try {
        ret = Buffer.from(hex, 'hex').toString(encoding);
    } catch (err) {
    }
    return ret;
}

export function isObjectEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Speed up calls to hasOwnProperty
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export function getCurrentRippleEpoch() {
    return Math.round((new Date()).getTime() / 1000) - 946684800 //946684800 is unix time epoch of 2000-1-1:00:00:00
}

export function getUnixTimeEpochFromRippleEpoch(rippleEpoch) {
    return (rippleEpoch + 946684800) * 1000
}

export function checkExpiration(expiration) {
    if (expiration) {

        const now = Date.now();
        const expire = (expiration > 946684800 ? expiration : expiration + 946684800) * 1000;

        if (expire < now)
            return true
    } else return false
}

export function fDate(date) {
    return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
    return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true
    });
}

export function fCurrency(number) {
    return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number) {
    return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
    return numeral(number).format();
}

export function fShortenNumber(number) {
    return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
    return numeral(number).format('0.0 b');
}

/**
 *
 * @param {string} tokenId
 * @returns {string | null} issuer of token
 */
export const getIssuer = (tokenId) => {
    return tokenId ? encodeAccountID(Buffer.from(tokenId.slice(8, 48), "hex")) : null;
}

export const getNFTfromURI = async (URI) => {
    let strURI = '';
    try {
        strURI = convertHexToString(URI);
    } catch (e) { }

    let hash = 'default';

    if (isIPFS.multihash(strURI))
        hash = strURI
    else if (isIPFS.ipfsUrl(strURI)) {
        var lastPart = strURI.split("/").pop();
        if (isIPFS.multihash(lastPart))
            hash = lastPart;
    }

    return hash;
}

/**
 * get image link from token URI, hex_uri
 * @param {string} URI
 */
export const getNFTokenInfo = async (tokenURI) => {
    // const uri = parseNFTUri(tokenURI);

    const hash = await getNFTfromURI(tokenURI);
    const uri = `https://gateway.xrpnft.com/ipfs/${hash}`;

    let img = '/static/nft.png';
    let data = '';
    let type = '';

    try {
        const res = await axios.get(uri);
        // console.log("res", res.data)
        type = res.headers['content-type'];

        if (type === 'application/geo+json') {
            data = res.data;
        }
        else if (type === 'application/json') { // if the response data is JSON object
            data = res.data;
            img = getImgUrlFromJSONResponse(res.data);
        }
        else if (type.slice(0, 5) === 'image') { // if the response is image
            data = res.data;
            img = uri;
        }
        else if (type.slice(0, 4) === 'text') { //if the response is text/html
            const NFTinfo = GetImgUrlFromHTMLResponse(res.data, uri)
            const des = getdataFromjosn(NFTinfo.metadata)
            // console.log("text description:", des.data)
            data = des.data;
            img = NFTinfo.image;
        }
        // else if (type.slice==='application/pdf'){
        // }
        else if (type === 'application/x-dbf') {
            data = res.data;
            img = getImgUrlFromJSONResponse(res.data);
        }
    } catch (e) {
        console.log(e.message)
    }

    return { type, data, img };
}
/**
 * get image link from token URI, hex_uri
 * @param {string} URI
 */
export const getNFTokenInfoNew = (res, tokenURI) => {

    if (!res) return {
        description: null,
        image: null
    }
    try {
        // const res = await axios.get(tokenURI)
        const type = res.headers['content-type']

        if (type === 'application/json') { // if the response data is JSON object
            return {
                description: res.data,
                image: getImgUrlFromJSONResponse(res.data)
            }
        }
        else if (type.slice(0, 5) === 'image') { // if the response is image
            return {
                description: null,
                image: tokenURI
            }
        }
        else if (type.slice(0, 4) === 'text') { //if the response is HTML/text
            const NFTinfo = GetImgUrlFromHTMLResponse(res.data, tokenURI)
            const des = getdataFromjosn(NFTinfo.metadata)
            return {
                description: des.data,
                image: NFTinfo.image
            }
        }
        else if (type === 'application/x-dbf') {
            return {
                description: res.data,
                image: getImgUrlFromJSONResponse(res.data)
            }
        }
        else {
            console.log('Unknown file type: ', res)
            return {
                description: null,
                image: null
            }
        }
    }
    catch (e) {
        console.log(e.message)
        return {
            description: null,
            image: null
        }
    }
}

const getGatewayUriFromHexURI = (hexURI) => {
    if (!hexURI) return null
    const parsedURI = parseNFTUri(hexURI)
    if (isIPFS.multihash(parsedURI)) {
        return `https://gateway.xrpnft.com/ipfs/${parsedURI}`;
    } else if (isIPFS.cidPath(parsedURI)) {
        return `https://gateway.xrpnft.com/ipfs/${parsedURI}`;
    } else if (parsedURI.startsWith("ipfs://")) {
        return parsedURI.replace("ipfs://", "https://gateway.xrpnft.com/ipfs/");
    } else if (parsedURI.startsWith("cid:")) {
        return parsedURI.replace("cid:", "https://gateway.xrpnft.com/ipfs/");
    } else if (parsedURI.startsWith('undefined')) {
        return parsedURI.replace('undefined', 'https://gateway.xrpnft.com/ipfs/')
    } else return null
}

/**
 * @description Get metadata from URI field, when the meta field of NFT is null, and URI exists.
 * @param {string} URI Hex URI
 * @returns {Object} Metadata
 */
export const getMetadata = async (URI) => {

    const ipfsUrl = getGatewayUriFromHexURI(URI)

    if (ipfsUrl) {
        const res = await axios.get(ipfsUrl)
        return res.data
    } else return null
}

export const getImgUrl = (meta) => {
    if (!meta) return '';
    const image = meta.image;
    const video = meta.video;

    if (!image && !video) return '';

    let url = video || image;

    if (isIPFS.multihash(url)) {
        url = `https://gateway.xrpnft.com/ipfs/${url}`;
    } else if (isIPFS.cidPath(url)) {
        url = `https://gateway.xrpnft.com/ipfs/${url}`;
    } else if (url.startsWith("https://")) {
    } else if (url.startsWith("ipfs://")) {
        url = url.replace("ipfs://", "https://gateway.xrpnft.com/ipfs/");
    } else if (url.startsWith("cid:")) {
        url = URI.replace("cid:", "https://gateway.xrpnft.com/ipfs/");
    } else if (url.startsWith("https://ipfs.filebase.io")) {
        url = URI.replace("https://ipfs.filebase.io", "https://gateway.xrpnft.com");
    }

    return url;
}

/**
 * used as fetcher for SWR
 * @param {string} url
 * @returns
 */
export const fetcher = url => axios.get(url).then(res => res)

// export const assetFromJSON = (asset: any): Asset => {
//     const isAnimated = asset.image_url && asset.image_url.endsWith(".gif");
//     const isSvg = asset.image_url && asset.image_url.endsWith(".svg");
//     const fromJSON: Asset = {
//       tokenId: asset.token_id.toString(),
//       tokenAddress: asset.asset_contract.address,
//       name: asset.name,
//       description: asset.description,
//       owner: asset.owner,
//       assetContract: assetContractFromJSON(asset.asset_contract),
//       collection: collectionFromJSON(asset.collection),
//       orders: asset.orders ? asset.orders.map(orderFromJSON) : null,
//       sellOrders: asset.sell_orders ? asset.sell_orders.map(orderFromJSON) : null,
//       buyOrders: asset.buy_orders ? asset.buy_orders.map(orderFromJSON) : null,

//       isPresale: asset.is_presale,
//       // Don't use previews if it's a special image
//       imageUrl:
//         isAnimated || isSvg
//           ? asset.image_url
//           : asset.image_preview_url || asset.image_url,
//       imagePreviewUrl: asset.image_preview_url,
//       imageUrlOriginal: asset.image_original_url,
//       imageUrlThumbnail: asset.image_thumbnail_url,

//       externalLink: asset.external_link,
//       Link: asset.permalink,
//       traits: asset.traits,
//       numSales: asset.num_sales,
//       lastSale: asset.last_sale ? assetEventFromJSON(asset.last_sale) : null,
//       backgroundColor: asset.background_color
//         ? `#${asset.background_color}`
//         : null,

//       transferFee: asset.transfer_fee ? makeBigNumber(asset.transfer_fee) : null,
//       transferFeePaymentToken: asset.transfer_fee_payment_token
//         ? tokenFromJSON(asset.transfer_fee_payment_token)
//         : null,
//     };
//     // If orders were included, put them in sell/buy order groups
//     if (fromJSON.orders && !fromJSON.sellOrders) {
//       fromJSON.sellOrders = fromJSON.orders.filter(
//         (o) => o.side == OrderSide.Sell
//       );
//     }
//     if (fromJSON.orders && !fromJSON.buyOrders) {
//       fromJSON.buyOrders = fromJSON.orders.filter((o) => o.side == OrderSide.Buy);
//     }
//     return fromJSON;
//   };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   export const assetEventFromJSON = (assetEvent: any): AssetEvent => {
//     return {
//       eventType: assetEvent.event_type,
//       eventTimestamp: assetEvent.event_timestamp,
//       auctionType: assetEvent.auction_type,
//       totalPrice: assetEvent.total_price,
//       transaction: assetEvent.transaction
//         ? transactionFromJSON(assetEvent.transaction)
//         : null,
//       paymentToken: assetEvent.payment_token
//         ? tokenFromJSON(assetEvent.payment_token)
//         : null,
//     };
//   };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   export const transactionFromJSON = (transaction: any): Transaction => {
//     return {
//       fromAccount: accountFromJSON(transaction.from_account),
//       toAccount: accountFromJSON(transaction.to_account),
//       createdDate: new Date(`${transaction.created_date}Z`),
//       modifiedDate: new Date(`${transaction.modified_date}Z`),
//       transactionHash: transaction.transaction_hash,
//       transactionIndex: transaction.transaction_index,
//       blockNumber: transaction.block_number,
//       blockHash: transaction.block_hash,
//       timestamp: new Date(`${transaction.timestamp}Z`),
//     };
//   };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   export const accountFromJSON = (account: any): Account => {
//     return {
//       address: account.address,
//       config: account.config,
//       profileImgUrl: account.profile_img_url,
//       user: account.user ? userFromJSON(account.user) : null,
//     };
//   };

export function getHashIcon(account) {
    let url = '/static/account_logo.png';
    try {
        const icon = hashicon(account, { createCanvas });
        url = icon.toDataURL();
    } catch (e) {
    }
    return url;
}
