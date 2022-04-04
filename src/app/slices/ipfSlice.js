import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pinnedFileHash: '',
  metadata: {
    name: '',
    description: '',
    externalLink: ''
  }
}
export const ipfSlice = createSlice({
  name: 'ipfs',
  initialState,
  reducers: {
    setPinnedFileHash: (state, action) => {
      state.pinnedFileHash = action.payload
    },
    setMetadata: (state, action) => {
      state.metadata = { ...state.metadata, ...action.payload }
    },
    resetIpfsState: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { setIpfsFileUrl, resetIpfsState, setPinnedFileHash } = ipfSlice.actions

export default ipfSlice.reducer