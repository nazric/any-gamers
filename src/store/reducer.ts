import { combineReducers } from "@reduxjs/toolkit";
import { opggApi } from "../api/opgg";

export const reducer = combineReducers({
  [opggApi.reducerPath]: opggApi.reducer
})