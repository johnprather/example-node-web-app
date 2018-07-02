import { combineReducers } from 'redux';
import identity from './identity.jsx';
import websocket from './websocket.jsx';

export default combineReducers({
  identity,
  websocket
});
