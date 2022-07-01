import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapState {
  style: any;
  styleStr: string;
}

const initialState: MapState = {
  style: null,
  styleStr: null as any,
};

export const counterSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setStyle: (state, action: PayloadAction<any>) => {
      state.style = action.payload;
      state.styleStr = JSON.stringify(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStyle } = counterSlice.actions;

export default counterSlice.reducer;
