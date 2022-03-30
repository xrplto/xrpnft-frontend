import { createSlice } from '@reduxjs/toolkit'

export const accountSlice = createSlice({
  name: 'filter',
  initialState: {
    key: '',
  },
  reducers: {
    select: (state, action) => {
      state.key = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { select } = accountSlice.actions

export default accountSlice.reducer