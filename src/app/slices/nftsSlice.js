import { createSlice } from '@reduxjs/toolkit'

export const nftsSlice = createSlice({
  name: 'nfts',
  initialState: {
    offset: 0,
    nfts:[],
    currenToken: {},
    currentScrollY: 0
  },
  reducers: {
    addNfts: (state, action) => {
      state.nfts.push(...action.payload)
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
export const { addNfts, increaseOffset, setCurrenToken, setCurrenScrollY } = nftsSlice.actions

export default nftsSlice.reducer