import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageReceiver from './MessageReceiver.jsx';
import WebsocketStatus from './WebsocketStatus.jsx';
import { setNickname } from '../actions/identity.jsx';
import {
  ConnectionState,
  connected,
  connecting,
  disconnected,
  setPingResult,
  setWs
} from '../actions/websocket.jsx';

// Websocket is a component to create and manage a websocket connection.
// Websocket addresses creation of new websockets and connection management.
// A child component, MessageReceiver, is relied upon to handle actual
// websocket messages.
class Websocket extends Component {
  constructor(props) {
    super(props);

    // if http loaded over ssl, then so should websocket
    let wsProto = (location.protocol == 'https:' ? 'wss:' : 'ws:');

    this.url = `${wsProto}\//${location.host}/${this.props.path}`;

    this.lastPong = 0;
  }

  // connect instantiates and configures a new websocket
  connect() {
    this.props.connecting();
    this.isDisconnecting = false;

    let ws = new WebSocket(this.url);

    ws.onopen = () => {
      // update connectionState (redux)
      this.props.connected();

      // start the ping loop
      this.sendPing();
    }

    ws.onclose = () => {
      // update connectionState (redux)
      this.props.disconnected();

      // prevent further ping attempts
      clearTimeout(this.pingTimeout);

      // clear stale values
      this.props.setWs(null);
      this.props.setPingResult(null);
      this.props.setNickname(null);

      // if not intentionally disconnecting, try to reconnect in a second
      if (!this.isDisconnecting) {
        this.reconnectTimeout = setTimeout(() => {
          this.connect();
        }, 1000);
      }
    }

    // save the new socket to app state (redux)
    this.props.setWs(ws);
  }

  // disconnect attempts to intentionally and cleanly disconnect the websocket
  disconnect() {
    this.isDisconnecting = true;
    clearTimeout(this.reconnectTimeout);
    clearTimeout(this.pingTimeout);
    this.props.ws.close();
  }

  // sendJSON stringifies passed objects and writes them to the websocket
  sendJSON(data) {
    this.props.ws.send(JSON.stringify(data));
  }

  // sendPing sends a ping message through the websocket and schedules the
  // next ping.  It is a suitable entry point to launch the infinite ping
  // cycle.  The pong responses are handled by MessageReceiver.
  sendPing() {
    let ts = (new Date()).getTime();
    this.sendJSON({
      action: 'ping',
      ts: ts
    });

    this.pingTimeout = setTimeout(() => {
      this.sendPing();
    }, 1000);
  }

  // componentDidMount attempts to create the websocket connection when this
  // Websocket component has been mounted to the DOM.
  componentDidMount() {
    this.connect();
  }

  // componentWillUnmount attempts to disconnect the websocket connection
  // when this Websocket component is about to be unmounted from the DOM.
  componentWillUnmount() {
    this.disconnect();
  }

  // shouldComponentUpdate always returns false because this component's
  // DOM never changes.
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
        <div>
          <MessageReceiver />
          <WebsocketStatus />
        </div>
    );
  }
}

// the redux state attributes mapped to Websockets' props
const mapStateToProps = state => {
  return {
    connectionState: state.websocket.connectionState,
    ws: state.websocket.ws
  }
};

// the redux dispatch actions mapped to Websockets' props
const mapDispatchToProps = {
  connected,
  connecting,
  disconnected,
  setNickname,
  setWs,
  setPingResult
};

// export the redux-connected Websocket
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Websocket);
