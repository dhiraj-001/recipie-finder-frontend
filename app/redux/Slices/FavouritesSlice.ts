import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserFavorite } from "../../../types/types";
import axios from "axios";
import { API_URL } from "@/services/FavouriteFetch";

const initialState = {
  favourites: [] as UserFavorite[]
}

const FavouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.favourites = action.payload })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        const { recipeId, isFavourite, title, image, userId } = action.meta.arg
        if (isFavourite) {
          state.favourites = state.favourites.filter(fav => String(fav.recipeId) !== recipeId)
        } else {
          state.favourites.push({
            userId,
            recipeId,
            title,
            image,
            createdAt: new Date().toISOString()
          })
        }
      })
  }
})

export const fetchFavorites = createAsyncThunk<UserFavorite[], string>(
  'favourites/fetchFavorites',
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getFavourites/${userId}`)
      return res.data.userFav
    } catch (error) {
      console.log("error fetching favourites", error)
      return thunkAPI.rejectWithValue("error fetching favourites");
    }
  })

export const toggleFavourite = createAsyncThunk<
  void,
  { userId: string | undefined; recipeId: string; title: string; image: string; isFavourite: boolean }
>(
  'favourites/toggleFavourite',
  async ({ userId, recipeId, title, image, isFavourite }, thunkAPI) => {
    try {
      if (isFavourite) {
        // If already favourite, remove it
        await axios.delete(`${API_URL}/delete/${userId}/${recipeId}`);
      } else {
        // If not favourite, add it
        await axios.post(`${API_URL}/favourite`, {
          userId, recipeId, title, image,
        });
      }
    } catch (error) {
      console.log("Error toggling favourite");
      return thunkAPI.rejectWithValue("Error toggling favourite");
    }
  }
);

export const addToFav = createAsyncThunk

export default FavouritesSlice.reducer
