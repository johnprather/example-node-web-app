import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nickname from './Nickname.jsx';
import Websocket from './Websocket.jsx';
import '../styles/App.css';

// App is the main application component, and should probably be rendered
// only once after the page loads.
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-top-bar">
          <Websocket path="ws"/>
          <Nickname />
          <div className="App-clear-left"></div>
        </div>
      </div>
    );
  }
}

export default App;
