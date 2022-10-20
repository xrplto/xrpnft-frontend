import ClassIcon from '@mui/icons-material/Class';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import CollectionsIcon from '@mui/icons-material/Collections';
import DnsIcon from '@mui/icons-material/Dns';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import PaymentsIcon from '@mui/icons-material/Payments';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PaletteIcon from '@mui/icons-material/Palette';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import FacebookIcon from '@mui/icons-material/Facebook';

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

export const CATEGORIES = [
    {
        title: 'NONE',
        icon: (<ClassIcon />)
    },
    {
        title: 'Art',
        icon: (<PaletteIcon />)
    },
    {
        title: 'Collectables',
        icon: (<CollectionsIcon />)
    },
    {
        title: 'Domain Names',
        icon: (<DnsIcon />)
    },
    {
        title: 'Music',
        icon: (<LibraryMusicIcon />)
    },
    {
        title: 'Photography',
        icon: (<WallpaperIcon />)
    },
    {
        title: 'Sports',
        icon: (<SportsBasketballIcon />)
    },
    {
        title: 'Trading Cards',
        icon: (<PaymentsIcon />)
    },
    {
        title: 'Utility',
        icon: (<HomeRepairServiceIcon />)
    },
    {
        title: 'Virtual Worlds',
        icon: (<ViewInArIcon />)
    },
];

export const XRP_TOKEN = {
    md5: 'xrp',
    name: 'XRP',
    issuer: 'XRPL',
    currency: 'XRP',
    ext: 'png',
    exch: '1'
};

export const COLLECTION_FAMILIES = [
    {
        title: 'Art',
        value: 'art',
        icon: (<PhotoLibraryIcon />)
    },
    {
        title: 'Social',
        value: 'social',
        icon: (<FacebookIcon />)
    }
];

export const NFToken = { // 5:30 AM 10/20/2022
    PREMINT: 8, // Submitted the NFTokenMint transaction but not found NFTokenID yet
    SELL_WITH_MINT: 16, // NFTs sell with MINT have this status flag, only in Bulk & Random collections.
  
    PREOFFER: 24, // Submitted the NFTokenCreateOffer transaction but not found SellOfferID yet
  
    FREE: 32,
  
    ERROR_BASE: 130,
    PREMINT_E1: 131, // Failed to submit the NFTokenMint transaction
    PREMINT_E2: 132, // Exception occured to submit the NFTokenMint transaction
    PREMINT_E3: 133, // Tried to find out NFTokenID but failed, only used in mint one
  
    PREOFFER_E1: 141, // Failed to submit the NFTokenCreateOffer transaction
    PREOFFER_E2: 142, // Exception occured to submit the NFTokenCreateOffer transaction
    PREOFFER_E3: 143, // Tried to find out SellOfferID but failed
  }