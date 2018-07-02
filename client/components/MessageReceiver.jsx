import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setNickname } from '../actions/identity.jsx';
import { setPingResult } from '../actions/websocket.jsx';

// MessageReceiver is a component which sets itself up to watch for and handle
// all incoming websocket messages on state.websocket.ws (WebSocket).
class MessageReceiver extends Component {
  constructor(props) {
    super(props);
    this.lastPong = 0;
    this.setHandlers();
    this.setListener();
  }

  // setListener will, if ws is not falsy, set the message handler function
  // for the websocket.  This should be done when this object is instantiated
  // (in case ws is already an instantiated websocket) as well as each time
  // the value of ws changes (catch this in shouldComponentUpdate below).
  setListener(ws) {
    if (ws) {
      ws.onmessage = (e) => {
        let msgData = null;
        try {
          msgData = JSON.parse(e.data);
        }
        catch (e) {
          console.log(`invalid JSON message: ${e.data}`);
        }
        if (msgData) {
          if (this.handlers.has(msgData.action)) {
            this.handlers.get(msgData.action)(msgData);
          }
        }
      }
    }
  }

  // shouldComponentUpdate detects changes to state.websocket.ws and triggers
  // setup of message event handler when a new state.websocket.ws is assigned,
  // but returns false always because there is no need to ever re-render the
  // DOM for this component.
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.ws != this.props.ws) {
      this.setListener(nextProps.ws);
    }
    return false;
  }

  // setHandlers is called by the constructor to intialize a map of functions
  // to use for handling incoming websocket messages.  Message attribute
  // 'action' (string) is being mapped to function which takes the message
  // object for handling.
  setHandlers() {
    this.handlers = new Map();

    this.handlers.set('pong', (data) => {
      if (data.ts > this.lastPong) {
        let timeDiff = (new Date()).getTime() - data.ts;
        this.props.setPingResult(timeDiff);
        this.lastPong = data.ts;
      }
    });

    this.handlers.set('identity', (data) => {
      this.props.setNickname(data.nickname);
    });
  }

  render() {
    return <div></div>;
  }
}

// the redux state attributes mapped to MessageReceivers' props
const mapStateToProps = state => {
  return {
    ws: state.websocket.ws
  }
}

// the redux dispatch actions mapped to MessageReceivers' props
const mapDispatchToProps = {
  setNickname,
  setPingResult
};

// export the redux-connected MessageReceiver
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageReceiver);
