// src/store/slices/dataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rows: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.rows = action.payload;
    },
    clearData: (state) => {
      state.rows = [];
    },
  },
});

export const { setData, clearData } = dataSlice.actions;
export default dataSlice.reducer;
