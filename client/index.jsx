import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers/index.jsx';
import App from './components/App.jsx';

// create the element into which we shall render our app because
// react throws warnings if we render it directly into body.
let body = document.getElementsByTagName("BODY")[0];
let appDiv = document.createElement('div');
appDiv.setAttribute('id', 'app');
body.appendChild(appDiv);

// create rudix store
const store = createStore(reducers);

// render the app!
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
