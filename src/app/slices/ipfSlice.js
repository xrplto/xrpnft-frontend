import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pickedFile: '',
  ipfsFileUrl: '',
  pinnedFileHash:'',
  metadata: {
    imageUrl: '',
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
    setPickedFile: (state, action) => {
      state.pickedFile = action.payload
    },
    setIpfsFileUrl: (state, action) => {
      state.ipfsFileUrl = action.payload
    },
    setImgUrl: (state, action) => {
      state.metadata.imageUrl = action.payload
    },
    setMetadata: (state, action) => {
      state.metadata = { ...state.metadata, ...action.payload }
    },
    resetIpfsState: () => initialState,
    resetPickedFile: (state) => {
      state.pickedFile = initialState.pickedFile}
  },
})

// Action creators are generated for each case reducer function
export const { setIpfsFileUrl, setImgUrl, resetIpfsState, setPickedFile, resetPickedFile, setPinnedFileHash } = ipfSlice.actions

export default ipfSlice.reducer