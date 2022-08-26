export const BASE_URL = 'https://api.xrpnft.com/api';
export const RIPPLE_TEST_NET_URL = 'wss://xls20-sandbox.rippletest.net:51233'
export const NEW_RIPPLE_TEST_NET_URL = 'wss://s.altnet.rippletest.net:51233'
export const PINATA_PINNING_FILE_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
export const PINATA_GATEWAY = 'https://xrpnft.mypinata.cloud/'
export const XRPNFT_DOMAIN = 'xrpnft.com/ipfs/'

export const SUPPORTED_FILE_TYPES = [
    'JPG',
    'PNG',
    // 'GIF',
    // 'SVG',
    // 'MP4',
    // 'WEBM',
    // 'WAV',
    // 'OGG',
    // 'GLB',
    // 'GLTF'
]

export const ACCOUNTS = [
    {
        id: 1,
        account: "rKVd5WtB8ugrxaTDTbJv6pVH7WunmyryLq",
    },
    {
        id: 2,
        account: "rEBKhngY8izMvRrgGg3Yh5zdiQgHH9cExg",
    },
    {
        id: 3,
        account: "rwj4mN7o5niF2zqoUajKGH5rXJwdWyLWF9",
    },
    {
        id: 4,
        account: "rQ3zXHDBM7mbZyNrUP1fGjhEfHT38dkx1v",
    },
    {
        id: 5,
        account: "rpcmZhxthTeWoLMpro5dfRAsAmwZCrsxGK",
    },
];
export const TOP_BAR_HEIGHT_DESKTOP = 33
export const BASIC_COLOR = '#00AB55'
export const tfTransferable = 0x00000008
export const tfTrustLine = 0x00000004
export const tfOnlyXRP = 0x00000002
export const tfBurnable = 0x00000001
export const TOKEN_FLAGS = [
    {
        label: 'Burnable',
        value: 1,
        desc: "If set, indicates that the issuer (or an entity authorized by the issuer) can destroy the object. The object's owner can always do so."
    },
    {
        label: 'OnlyXRP',
        value: 2,
        desc: 'If set, nft can only be offered or sold for XRP.'
    },
    {
        label: 'TrustLine',
        value: 4,
        desc: 'If set, indicates that the issuer wants a trustline to be automatically created. The lsfTrustLine field is useful when the token can be offered for sale for assets other than XRP and the issuer charges a TransferFee. If this flag is set, a trust line is automatically created as needed to allow the issuer to receive the appropriate transfer fee. If this flag is not set, an attempt to transfer the NFToken for an asset for which the issuer does not have a trustline fails.'
    },
    {
        label: 'Transferable',
        value: 8,
        desc: '	If set, indicates that this NFT can be transferred. This flag has no effect if the token is being transferred from the issuer or to the issuer.'
    },
]

export const NON_FLAGS = [6, 7, 14, 15]
