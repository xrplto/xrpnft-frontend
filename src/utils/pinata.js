import pinataSDK from '@pinata/sdk'
import { cipheredTaxon, parseNftFlag } from 'utils'
import BigNumber from 'bignumber.js'
import axios from 'axios';
// import parsePinataNFTUrl from 'utils/pinata'
// import xrpl from 'xrpl'
const xrpl = require("xrpl");

const AddressCodec = require('ripple-address-codec');

const pinata = pinataSDK(process.env.REACT_APP_PINATA_API_KEY, process.env.REACT_APP_PINATA_SECRET_KEY)

export const testPinata = async () => {
    try {
        const res = await pinata.testAuthentication()
        console.log(res)
        return res
    } catch (e) {
        console.log(e)
        return { authenticated: false }
    }
}

const options = {
    pinataMetadata: {
        name: 'XRPNFT',
        keyValues: {
            decription: 'pinned nft metadata',
            properties: 'metadata'
        }
    },
    pinataOptions: {
        cidVersion: 0
    }
}

/**
 * Send JSON to Pinata for direct pinning to IPFS.
 * @param {Object} body Javascript object or Valid JSON you wish to pin to IPFS
 * @returns {Object} { success : true | false,
 * response ? : {
        IpfsHash : This is the IPFS multi-hash provided back for your content,
        PinSize : This is how large (in bytes) the content you just pinned is,
        Timestamp : This is the timestamp for your content pinning (represented in ISO 8601 format)
    }
 */
export const pinJsonToIPFS = async (body) => {
    console.log('Pinning JSON to pinata')
    try {
        const res = await pinata.pinJSONToIPFS(body, options)
        console.log('Pinning JSON result from Pinata:', res)
        return { success: true, response: res }
    } catch (e) {
        console.log(e)
        return { success: false }
    }
}

export const getMetadataFromURI = async (uri) => {
    const res = await axios.get(uri)
    console.log('metadata from axios', res)
}

export const parsePinataNFTUrl = (tokenURL) => {
    if (!tokenURL) return null;
    else return xrpl.convertHexToString(tokenURL)
}

export function parsePinataNFT(tokenID, tokenURI) {

    if (typeof tokenID !== "string" || tokenID.length !== 64) {
        return null;
    }

    const flags = new BigNumber(tokenID.slice(0, 4), 16).toNumber();
    const transferFee = new BigNumber(tokenID.slice(4, 8), 16).toNumber();
    const issuer = AddressCodec.encodeAccountID(Buffer.from(tokenID.slice(8, 48), "hex"));
    const scrambledTaxon = new BigNumber(tokenID.slice(48, 56), 16).toNumber();
    const sequence = new BigNumber(tokenID.slice(56, 64), 16).toNumber();

    return {
        issuer: issuer,
        flags: parseNftFlag(flags),
        tokenID: tokenID,
        tokenURI: parsePinataNFTUrl(tokenURI),
        transferFee: transferFee,
        tokenTaxon: cipheredTaxon(sequence, scrambledTaxon),
        sequence: sequence,
    };
}
