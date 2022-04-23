import PropTypes from 'prop-types';

// export const NFTokenProps = {
//     tokenID : PropTypes.string,
//     URI: PropTypes.string
// }

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
    nftoken: PropTypes.object
}

export const NFTokenProps = {
    tid: PropTypes.string,
    flag: PropTypes.number,
    issuer: PropTypes.string,
    uri: PropTypes.string | null
}

export const ListingsListProps = {
    tokenID: PropTypes.string,
    listings: PropTypes.object,
    owner: PropTypes.string
}

export const TraitProps = {
    id: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string
}

export const AddTraitDgProp = {
    save: PropTypes.func,
    close: PropTypes.func,
    properties: PropTypes.array
}
