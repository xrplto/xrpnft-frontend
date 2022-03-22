const initialState = {
    flag: 0,
    isBurnable: false,
    isOnlyXrp: false,
    isTrustline: false,
    isTransferable: false,
}

export default function filterReducer(state = initialState, action) {
    switch (action.type) {
        case 'filters/toggleBurnable': {
            return {
                ...state,
                isBurnable: !state.filters.isBurnable,
                flag: state.filters.flag ^ 0x00000001
            }
        }
        case 'filters/toggleOnlyXrp': {
            return {
                ...state,
                isOnlyXrp: !state.filters.isOnlyXrp,
                flag: state.filters.flag ^ 0x00000002
            }
        }
        case 'filters/toggleTrustline': {
            return {
                ...state,
                isTrustline: !state.filters.isTrustline,
                flag: state.filters.flag ^ 0x00000004
            }
        }
        case 'filters/toggleTransferable': {
            return {
                ...state,
                isTransferable: !state.filters.isTransferable,
                flag: state.filters.flag ^ 0x00000008
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state
    }
}
