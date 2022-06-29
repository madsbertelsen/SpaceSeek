import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  root_screen_id: number;
}

const initialState: ConfigState = {
  root_screen_id: 0,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<any>) => {
      state.root_screen_id = action.payload.root_screen_id;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
