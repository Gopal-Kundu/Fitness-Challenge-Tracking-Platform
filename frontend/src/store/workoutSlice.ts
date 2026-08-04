import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  viewMode: 'grid',
  selectedType: 'All Modules',
  selectedIntensity: 'Mid',
  selectedDuration: 'Any Duration',
  searchQuery: '',
  workouts: []
};

export const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setSelectedIntensity: (state, action) => {
      state.selectedIntensity = action.payload;
    },
    setSelectedDuration: (state, action) => {
      state.selectedDuration = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setWorkouts: (state, action) => {
      state.workouts = action.payload;
    },
    resetFilters: (state) => {
      state.selectedType = 'All Modules';
      state.selectedIntensity = 'Mid';
      state.selectedDuration = 'Any Duration';
      state.searchQuery = '';
    }
  }
});

export const {
  setViewMode,
  setSelectedType,
  setSelectedIntensity,
  setSelectedDuration,
  setSearchQuery,
  setWorkouts,
  resetFilters
} = workoutSlice.actions;

export default workoutSlice.reducer;
