import {
  ConnectionState,
  SET_CONNECTION_STATE,
  SET_PINGRESULT,
  SET_WS
} from '../actions/websocket.jsx';

const initialState = {
  ws: null,
  pingResult: null,
  connectionState: 'disconnected',
  sendQueue: []
}

const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONNECTION_STATE:
      return Object.assign({}, state, {
        connectionState: action.value
      });
    case SET_PINGRESULT:
      return Object.assign({}, state, {
        pingResult: action.value
      });
    case SET_WS:
      let newState = Object.assign({}, state, {
        ws: action.value,
      });
      if (!action.value) {
        newState['connectionState'] = ConnectionState.DISCONNECTED;
      }
      return newState;
    default:
      return state;
  }
}

export default websocketReducer;
