import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./Slices/themeSlice"; 
import favouritesReducer from "./Slices/FavouritesSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    favourites: favouritesReducer
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch