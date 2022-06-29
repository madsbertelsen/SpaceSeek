export type BottomRoute = 'home' | 'search' | 'settings';

export const bottomRoutes: {
  [routeKey in BottomRoute]: BottomRoute;
} = {
  // home: 'home',
  settings: 'settings',
  home: 'home',
  search: 'search',
};

export type SpaceRoute = 'details' | 'tourdetails';

export const spaceRoutes: {
  [routeKey in SpaceRoute]: SpaceRoute;
} = {
  details: 'details',
  tourdetails: 'tourdetails',
};
