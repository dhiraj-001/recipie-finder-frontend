import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: 'dark', // Set a static default theme
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state,action) =>{
      state.theme = action.payload
    },
    switchTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { switchTheme,setTheme } = themeSlice.actions;
export default themeSlice.reducer;