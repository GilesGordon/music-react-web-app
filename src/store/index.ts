import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "../Spotify/reducer";
export interface TokenState {
    tokenReducer: {
    tokens: any;
  };
}
const store = configureStore({
  reducer: {
    tokenReducer
  }
});


export default store;