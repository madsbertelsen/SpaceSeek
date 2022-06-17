import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  features: Feature[];
  value: number;
}

const initialState: CounterState = {
  features: [],
  value: 0,
};

export const counterSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.features = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFeatures } = counterSlice.actions;

export default counterSlice.reducer;
