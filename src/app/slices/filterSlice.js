import { createSlice } from '@reduxjs/toolkit'

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    flag: 0,
  },
  reducers: {
    changeFilter: (state, action) => {
      state.flag ^= action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { changeFilter } = filterSlice.actions

export default filterSlice.reducer