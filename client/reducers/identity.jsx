import { SET_NICKNAME } from '../actions/identity.jsx';

const initialState = {
  nickname: null
};

const identityReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NICKNAME:
      return Object.assign({}, state, {
        nickname: action.value
      });
    default:
      return state;
  }
}

export default identityReducer;
