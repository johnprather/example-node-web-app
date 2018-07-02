import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ConnectionState } from '../actions/websocket.jsx';
import PingResult from './PingResult.jsx';
import '../styles/WebsocketStatus.css';

// WebsocketStatus is a component which watches redux state for the
// websocket's connection status and presents relevant info.
class WebsocketStatus extends Component {
  render() {
    let pingResult = null;
    if (this.props.connectionState == ConnectionState.CONNECTED) {
      pingResult = <PingResult />;
    }
    return (
      <span className="WebsocketStatus">
        {this.props.connectionState}
        {pingResult}
      </span>
    )
  }
}

// the redux state attributes mapped to WebsocketStatus' props
const mapStateToProps = state => {
  return {
    connectionState: state.websocket.connectionState,
  }
}

// export the redux-connected WebsocketStatus
export default connect(
  mapStateToProps
)(WebsocketStatus);
