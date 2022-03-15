import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import filterReducer from './slices/filterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer,
    filter: filterReducer,
  },
})