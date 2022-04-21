import { format, formatDistanceToNow } from 'date-fns';
import { replace } from 'lodash';
import numeral from 'numeral';
const xrpl = require("xrpl");
const AddressCodec = require('ripple-address-codec');
const { BigNumber } = require('bignumber.js');

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

export const parseNFTUri = (tokenURI) => {
    const regex_hex = /^[a-z0-9]+$/i
    const regex_uri = /^[a-z0-9:./]+$/i
    if (!tokenURI || tokenURI.length > 256 ) return null
    if (regex_hex.test(tokenURI)) {
        const uriString = xrpl.convertHexToString(tokenURI)
        if (regex_uri.test(uriString) && uriString.length > 45) { // min length of ipfs hash is 46

            if (uriString.slice(0, 10) === 'xrpnft.com') // the tokenURI minted from this site
                return {
                    header: 'xrpnft.com',
                    main: uriString.slice(11)
                }
            else return {
                header: 'common',
                main: uriString
            }
        }
        else return null
    }
    else return null
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
export function parseNFT(tokenID, tokenURI) {
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
        tokenURI: parseURI(tokenURI),
        transferFee: transferFee,
        tokenTaxon: cipheredTaxon(sequence, scrambledTaxon),
        sequence: sequence,
    };
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
    return tokenId ? AddressCodec.encodeAccountID(Buffer.from(tokenId.slice(8, 48), "hex")) : null;
}