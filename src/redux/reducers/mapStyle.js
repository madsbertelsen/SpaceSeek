const defaultState = [];
export const SET_MAPSTYLE = 'SET_MAPSTYLE';

function reducer(state = defaultState, { type, payload }) {
  switch (type) {
    case 'SET_MAPSTYLE': {
      return payload;
    }
    default:
      return state;
  }
}

export default reducer;
