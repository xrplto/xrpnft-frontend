import { combineReducers } from 'redux'
import filterReducer from './slices/filterSlice'
import nftsReducer from './slices/nftsSlice'

const rootReducer = combineReducers({
  filter: filterReducer,
  nfts: nftsReducer
})
export default rootReducer