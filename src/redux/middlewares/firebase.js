import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const firebase = (store) => (next) => (action) => {
  switch (action.type) {
    // BOOKMARKS
    case 'ADD_BOOKMARK':
      next(action);
      database()
        .ref(`/bookmarks/${auth().currentUser.uid}/${action.payload.id}`)
        .set({...action.payload, created: new Date().getTime()});
      break;
    case 'DELETE_BOOKMARK':
      next(action);
      database()
        .ref(`/bookmarks/${auth().currentUser.uid}/${action.payload}`)
        .remove();
      break;
    // BOOKINGS
    case 'ADD_BOOKING':
      next(action);
      database()
        .ref(`/bookings/${auth().currentUser.uid}/${action.payload.id}`)
        .set({...action.payload, created: new Date().getTime()});
      break;
    default:
      next(action);
  }
};

export default firebase;
