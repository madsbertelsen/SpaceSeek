import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfigState {
  root_screen_id: number;
  stack: number[];
}

const initialState: ConfigState = {
  root_screen_id: 0,
  stack: [],
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<any>) => {
      state.root_screen_id = action.payload.root_screen_id;
      state.stack = [action.payload.root_screen_id];
    },
    pushScreen: (state, action: PayloadAction<{ id: number }>) => {
      state.stack.push(action.payload.id);
    },
    popScreen: (state) => {
      state.stack.pop();
    },
  },
});

// Action creators are generated for each case reducer function
export const { setConfig, pushScreen, popScreen } = configSlice.actions;

export default configSlice.reducer;
