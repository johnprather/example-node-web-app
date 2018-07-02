export const SET_WS = 'SET_WS';
export const SET_PINGRESULT = 'SET_PINGRESULT';
export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';

export const ConnectionState = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected'
}

export const setWs = value => {
  return { type: SET_WS, value };
};

export const setPingResult = value => {
  return { type: SET_PINGRESULT, value };
};

export const connecting = () => {
  return { type: SET_CONNECTION_STATE, value: ConnectionState.CONNECTING };
}

export const connected = () => {
  return { type: SET_CONNECTION_STATE, value: ConnectionState.CONNECTED };
}

export const disconnected = () => {
  return { type: SET_CONNECTION_STATE, value: ConnectionState.DISCONNECTED };
}
