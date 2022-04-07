import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  offset: 0,
  nfts:[],
  currenToken: {},
  currentScrollY: 0
}

export const nftsSlice = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    resetNFTs: () => initialState,
    addNfts: (state, action) => {
      // state.nfts.push(...action.payload)
      state.nfts = [...state.nfts, ...action.payload]
    },
    increaseOffset: (state) => {
      state.offset ++
    },
    setCurrenToken: (state, action) => {
      state.currenToken = action.payload
    },
    setCurrenScrollY: (state, action) => {
      state.currentScrollY = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addNfts, increaseOffset, setCurrenToken, setCurrenScrollY, resetNFTs } = nftsSlice.actions

export default nftsSlice.reducer