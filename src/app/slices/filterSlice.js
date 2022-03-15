import { createSlice } from '@reduxjs/toolkit'

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    flag: 0,
    isBurnable: false,
    isOnlyXrp: false,
    isTrustline: false,
    isTransferable: false,
  },
  reducers: {
    toggleBurnable: (state) => {
      state.isBurnable = !state.isBurnable
      state.flag ^= 0x00000001;
    },
    toggleOnlyXrp: (state) => {
      state.isOnlyXrp = !state.isOnlyXrp
      state.flag ^= 0x00000002;
    },
    toggleTrustline: (state) => {
      state.isTrustline = !state.isTrustline
      state.flag ^= 0x00000004;
    },
    toggleTransferable: (state) => {
      state.isTransferable = !state.isTransferable
      state.flag ^= 0x00000008;
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleBurnable, toggleOnlyXrp, toggleTrustline, toggleTransferable } = filterSlice.actions

export default filterSlice.reducer