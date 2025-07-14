import { configureStore } from "@reduxjs/toolkit";
import favoriteSlice from "./favoriteSlice";

export const store = configureStore({
    reducer: {
        favorites: favoriteSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;