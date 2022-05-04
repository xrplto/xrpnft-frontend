import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pinnedFileHash: '',
  flags: 13,
  metadata: {
    name: '',
    description: '',
    externalLink: '',
    properties: [],
    levels: [],
  }
}
export const ipfSlice = createSlice({
  name: 'ipfs',
  initialState,
  reducers: {
    setPinnedFileHash: (state, action) => {
      state.pinnedFileHash = action.payload
    },
    setFlags: (state, action) => {
      state.flags = action.payload
    },
    setMetadata: (state, action) => {
      state.metadata = { ...state.metadata, ...action.payload }
    },
    setLevels: (state, action) => {
      state.metadata.levels = [...action.payload]
    },
    resetIpfsState: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { setMetadata, resetIpfsState, setPinnedFileHash, setFlags, setLevels } = ipfSlice.actions

export default ipfSlice.reducer