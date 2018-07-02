import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/Nickname.css';

// Nickname is a component which displays state.identity.nickname.
class Nickname extends Component {
  render() {
    if (!this.props.nickname) {
      return <span></span>;
    }
    return (
      <span className="Nickname">{this.props.nickname}</span>
    )
  }
}

const mapStateToProps = state => {
  return {
    nickname: state.identity.nickname
  }
}

export default connect(
  mapStateToProps
)(Nickname);
