import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  account: {
    key: null,
    secret: null
  },
}

export const accountSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    select: (state, action) => {
      state.account = {...action.payload};
    },
    reset: () => initialState
  },
})

// Action creators are generated for each case reducer function
export const { select, reset } = accountSlice.actions

export default accountSlice.reducer