import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  offset: 0,
  nfts: [],
  currentScrollY: 0
}

export const nftsSlice = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    resetNFTs: () => initialState,
    addNfts: (state, action) => {
      state.nfts = [...state.nfts, ...action.payload]
    },
    increaseOffset: (state) => {
      state.offset++
    },
    setCurrenScrollY: (state, action) => {
      state.currentScrollY = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addNfts, increaseOffset, setCurrenScrollY, resetNFTs } = nftsSlice.actions

export default nftsSlice.reducer