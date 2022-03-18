import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice'
import nftsReducer from './slices/nftsSlice'

export default configureStore({
  reducer: {
    filter: filterReducer,
    nfts: nftsReducer
  },
})