import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/PingResult.css';

// PingResult is a component which renders the current pingResult if
// the state.websocket.connectionState is connected.
class PingResult extends Component {
  render() {
    if (this.props.pingResult == null) {
      return <span></span>;
    }
    return (
      <span className="PingResult">{this.props.pingResult} ms</span>
    )
  }
}

// the redux state attributes mapped to PingResults' props
const mapStateToProps = state => {
  return {
    connectionState: state.websocket.connectionState,
    pingResult: state.websocket.pingResult
  }
}

// export the redux-connected PingResult
export default connect(
  mapStateToProps
)(PingResult);
