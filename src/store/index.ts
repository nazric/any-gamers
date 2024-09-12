import { configureStore } from "@reduxjs/toolkit"
import { reducer } from "./reducer"
import { opggApi } from "../api/opgg"

export const setupStore = () => {
  return configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
        .concat(opggApi.middleware),
  })
}

export type RootState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
