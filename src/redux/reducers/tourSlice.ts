import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Geometry, lineSliceAlong } from '@turf/turf';
import { sortWaypoints } from '../../utils';

export type LocalFeature = Feature & { symbol: string; location: number };

export interface TourState {
  features: LocalFeature[];
  tour: Feature;
  focusWaypointIndex: number;
  focusWaypoint: LocalFeature;
  elapsedRoute: Geometry;
}

const initialState: TourState = {
  features: [],
  focusWaypointIndex: 0,
  tour: undefined as any,
  focusWaypoint: undefined as any,
  elapsedRoute: undefined as any,
};

export const counterSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    setFocusWaypoint: (
      state,
      action: PayloadAction<{ index: number; elapsedRoute: any; focus: any }>,
    ) => {
      //  const focus = state.features[action.payload.index];
      state.focusWaypoint = action.payload.focus;
      state.focusWaypointIndex = action.payload.index;

      state.elapsedRoute = action.payload.elapsedRoute;
      /*
      state.elapsedRoute = lineSliceAlong(
        state.tour.geometry,
        0,
        state.focusWaypoint.location,
        { units: 'meters' },
      ).geometry;
      */
    },
    loadTour: (
      state,
      action: PayloadAction<{ lineFeature: Feature; pointFeatures: Feature[] }>,
    ) => {
      state.tour = action.payload.lineFeature;

      const features = sortWaypoints({
        context: { ...action.payload.lineFeature, type: 'Feature' },
        features: action.payload.pointFeatures,
      });
      state.features = features.map((f, idx) => {
        const symbol =
          idx === 0 ? 'A' : idx === features.length - 1 ? 'B' : '' + idx;
        return {
          ...f,
          type: 'Feature',
          symbol,
          location: f.properties.location as number,
        };
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { loadTour, setFocusWaypoint } = counterSlice.actions;

export default counterSlice.reducer;
