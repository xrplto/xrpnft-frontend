import PropTypes from 'prop-types';

export const SnackbarProps = {
    isOpen: PropTypes.bool,
    close: PropTypes.func,
    message: PropTypes.string,
    variant: PropTypes.string
}

export const PinataNFTCardProps = {
    nftoken: PropTypes.object
}

export const NFTCardProps = {
    Flags: PropTypes.number,
    // Issuer: PropTypes.string,
    NFTokenID: PropTypes.string,
    // NFTokenTaxon: PropTypes.number,
    URI: PropTypes.string,
    // nft_serial: PropTypes.number
}

export const ListingsListProps = {
    tokenID: PropTypes.string,
    listings: PropTypes.object,
    owner: PropTypes.string
}

export const TraitProps = {
    id: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.number,
    total: PropTypes.number,
}

export const NFTPreviewProps = {
    uri: PropTypes.string,
    title: PropTypes.string,
    favorites: PropTypes.number,
}

export const AddTraitDgProp = {
    // save: PropTypes.func,
    close: PropTypes.func,
    properties: PropTypes.array
}

export const AddLevelDgProp = {
    // save: PropTypes.func,
    close: PropTypes.func,
    properties: PropTypes.array
}

export const NFTDetailsProps = {
    NFTokenID: PropTypes.string,
    NFToken: PropTypes.object,
    ParsedURI: PropTypes.string,
    data: PropTypes.object
}


