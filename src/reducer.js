import { combineReducers } from 'redux'

import filterReducer from './app/features/filterSlice'
import nftsReducer from './app/features/nftsSlice'

const rootReducer = combineReducers({
    // nfts: nftsReducer,
    filters: filterReducer
})

export default rootReducer
