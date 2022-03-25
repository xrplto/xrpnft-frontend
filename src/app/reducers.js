import { combineReducers } from 'redux'
import filterReducer from './slices/filterSlice'
import nftsReducer from './slices/nftsSlice'
import ipfsReducer from './slices/ipfSlice'
const rootReducer = combineReducers({
  filter: filterReducer,
  nfts: nftsReducer,
  ipfs: ipfsReducer
})
export default rootReducer