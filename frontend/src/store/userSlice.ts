import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: "",
  email: "",
  image: "https://shorturl.at/FmV3K",
  avatar: "https://shorturl.at/FmV3K",
  completedCalories: 0,
  completedWorkoutsCount: 0,
  completedChallengesCount: 0,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    }
  },
});

export const { updateUser, setUser } = userSlice.actions;
export default userSlice.reducer;
