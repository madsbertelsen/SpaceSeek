import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureCollection } from '@turf/turf';

interface Padding {
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
}

interface Bounds {
  sw: number[];
  ne: number[];
}

export interface ConfigState {
  root_screen_id: number;
  sheetStack: { id: number; bounds: number[] }[];

  mapConfig: {
    padding: Padding;
    bounds: number[];
    featureCollection: FeatureCollection;
  };
  bounds: number[];
  padding: Padding;
  _padding: Padding;
}

const initialState: ConfigState = {
  root_screen_id: 0,
  sheetStack: [] as any,
  mapConfig: {},
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<any>) => {
      state.root_screen_id = action.payload.root_screen_id;
      state.sheetStack = [
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
    pushSheet: (
      state,
      action: PayloadAction<{ id: number; bounds: number[] }>,
    ) => {
      state.padding = state._padding;
      state.sheetStack.push({ id: action.payload.id, bounds: [] });
      state.sheetStack[state.sheetStack.length - 1].bounds =
        action.payload.bounds;
    },
    popSheet: (state) => {
      state.bounds = state.sheetStack[state.sheetStack.length - 1].bounds;
      state.padding = undefined as any;
      state.sheetStack.pop();
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setConfig,
  pushSheet,
  popSheet,
  setBounds,
} = configSlice.actions;

export default configSlice.reducer;
