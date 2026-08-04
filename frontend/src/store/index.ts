import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import workoutReducer from './workoutSlice';
import challengeReducer from './challengeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    workout: workoutReducer,
    challenge: challengeReducer,
  },
});
