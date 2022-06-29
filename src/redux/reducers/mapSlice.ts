import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  style: any;
}

const initialState: MapState = {
  style: null,
};

export const counterSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setStyle: (state, action: PayloadAction<any>) => {
      state.style = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStyle } = counterSlice.actions;

export default counterSlice.reducer;
