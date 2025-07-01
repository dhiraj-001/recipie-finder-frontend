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
    findFavourite: (state, action) => {

    },
    addFavoruites: (state, action) => {
      state.favourites = [...action.payload]
    }
  },
  extraReducers :(builder) =>{
    builder
    .addCase(fetchFavorites.fulfilled, (state,action)=>{state.favourites = action.payload})
  }
})

export const fetchFavorites = createAsyncThunk<UserFavorite[], string>(
  'favourites/fetchFavorites',
  async (userId,thunkAPI) => {
   try {
     const res = await axios.get(`${API_URL}/getFavourites/${userId}`)
      return res.data.userFav
      
   } catch (error) {
    console.log("error fetching favourites", error)
    return thunkAPI.rejectWithValue("error fetching favourites");
   }
  })

export const { findFavourite, addFavoruites } = FavouritesSlice.actions
export default FavouritesSlice.reducer
