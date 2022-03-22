const initialState = {
  offset: 0,
  nfts: [],
  currenToken: {}
}

export default function nftsReducer(state = initialState, action) {
  switch (action.type) {
    case 'nfts/addNfts': {
      return {
        ...state,
        nfts: [...state.nfts, ...action.payload],
      }
    }
    case 'nfts/increaseOffset': {
      return {
        ...state,
        offset: state.offset + 1
      }
    }
    case 'nfts/setCurrenToken': {
      return {
        ...state,
        currenToken: action.payload
      }
    }
    default:
      // If this reducer doesn't recognize the action type, or doesn't
      // care about this specific action, return the existing state unchanged
      return state
  }
}
