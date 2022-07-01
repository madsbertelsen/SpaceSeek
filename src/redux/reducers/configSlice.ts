import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Padding {
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
}

export interface ConfigState {
  root_screen_id: number;
  screenStack: { id: number; bounds: number[] }[];
  bounds: number[];
  padding: Padding;
  _padding: Padding;
}

const initialState: ConfigState = {
  root_screen_id: 0,
  screenStack: [] as any,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<any>) => {
      state.root_screen_id = action.payload.root_screen_id;
      state.screenStack = [
        { id: action.payload.root_screen_id, bounds: undefined as any },
      ];
    },

    setBounds: (
      state,
      action: PayloadAction<{ bounds: number[]; padding: Padding }>,
    ) => {
      state.bounds = action.payload.bounds;
      if (action.payload.padding) {
        state._padding = action.payload.padding;
        state.padding = action.payload.padding;
      }
    },
    pushScreen: (
      state,
      action: PayloadAction<{ id: number; bounds: number[] }>,
    ) => {
      state.padding = state._padding;
      state.screenStack.push({ id: action.payload.id, bounds: [] });
      state.screenStack[state.screenStack.length - 1].bounds =
        action.payload.bounds;
    },
    popScreen: (state) => {
      state.bounds = state.screenStack[state.screenStack.length - 1].bounds;
      state.padding = undefined as any;
      state.screenStack.pop();
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setConfig,
  pushScreen,
  popScreen,
  setBounds,
} = configSlice.actions;

export default configSlice.reducer;
