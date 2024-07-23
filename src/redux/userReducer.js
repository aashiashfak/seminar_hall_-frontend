import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userData",
  initialState: {
    user: JSON.parse(localStorage.getItem("userData")) || null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
      localStorage.removeItem("tasks");
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
