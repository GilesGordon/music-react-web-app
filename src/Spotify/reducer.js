import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokens: {
    access_token: null,
    refresh_token: null,
  },
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setToken: (state, action) => {
      console.log("setToken")
      console.log(action.payload)
      state.tokens.access_token = action.payload.access_token;
      state.tokens.refresh_token = action.payload.refresh_token;
    },
  },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;