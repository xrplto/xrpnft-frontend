import PropTypes from 'prop-types';

export const NFTokenProps = {
    tokenID : PropTypes.string,
    URI: PropTypes.string
}

export const SnackbarProps = {
    isOpen: PropTypes.bool,
    close: PropTypes.func,
    message: PropTypes.string,
    variant: PropTypes.string
}

export const PinataNFTCardProps = {
    nftoken: PropTypes.object
}

export const ListingsListProps = {
    tokenID: PropTypes.string,
    listings: PropTypes.object,
    owner: PropTypes.string
}
