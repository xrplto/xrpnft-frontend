import { createSlice } from '@reduxjs/toolkit'

export const ipfSlice = createSlice({
  name: 'ipfs',
  initialState: {
    ipfsFileUrl: '',
    metadata: {
      imageUrl: '',
      name:'',
      description:'',
      externalLink:''
    }
  },
  reducers: {
    setIpfsFileUrl: (state, action) => {
      state.ipfsFileUrl = action.payload
    },
    setImgUrl: (state, action) => {
      state.metadata.imageUrl = action.payload
    },
    setMetadata: (state, action) => {
      state.metadata = {...state.metadata, ...action.payload}
    },
    resetIpfsState: (state) => {
      // state = undefined
      state.metadata.imageUrl = ''
      // state =  {
      //   ipfsFileUrl:'',
      //   metadata: {
      //     imageUrl: '',
      //     description: '',
      //     name: '',
      //     externalLink: ''
      //   }
      // }
    }
  },
})

// Action creators are generated for each case reducer function
export const { setIpfsFileUrl, setImgUrl, resetIpfsState } = ipfSlice.actions

export default ipfSlice.reducer