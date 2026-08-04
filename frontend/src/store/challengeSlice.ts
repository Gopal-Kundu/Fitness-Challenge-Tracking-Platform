import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCategory: 'ALL CHALLENGES',
  challenges: []
};

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setChallenges: (state, action) => {
      state.challenges = action.payload;
    }
  }
});

export const { setSelectedCategory, setChallenges } = challengeSlice.actions;
export default challengeSlice.reducer;
