# Example Node Web App

**What is it?**

This application provides functional examples of some of the following
technologies:

* Webpack - Webpack is leveraged to build all static HTML and JS assets using
the JSX and CSS source code.
* React - Facebook's React library is used to manage the application's DOM.
The jquery library is not included in this application.
* Redux - the Redux library is used to handle application state changes,
providing the glue between data changes throughout the application and the
UI elements (React components) which reflect those changes.
* WebSockets - WebSocket technology is leveraged to provide a realtime-like
experience with event messages being pushed across an established
bidirectional stream between the clients and the server.
* Node - the server is run with Node.js, so JavaScript (ES6) is the only
programming language utilized by the application.

**Why is it?**

* Example usage of Webpack?
* Example usage of Node?
* Example usage of React?
* Example usage of Redux?
* Example usage of WebSockets?
* Starting point for a new realtime-like Node application?

**What's it do?**

Very little.

On the server:
* static client assets are served by http service
* websocket connections are accepted by websocket service
* new connections are assigned a nickname
* ping messages are responded to with pong messages

On the client:
* websocket connection attempted as soon as page loads
* connection state (with ping, when connected) indicated in top right of page
* nickname assigned by server indicated in top left of page (when connected)
* infinite ping cycle when connected

It's really, really boring.

## Usage

### Environment

The default bind address is 127.0.0.1 and default port is 8080.  The
`BIND_ADDRESS` and `BIND_PORT` environment variables may be set to
specify a different bind address or port.

### Building the Client

There is a job defined in package.json which builds the client (static JS and
CSS assets).  To run it, execute `npm run build`.

If you plan to run the server immediately after building it, however, see
the next section.

### Running the Server

There is a job defined in package.json which launches the application server.
To run it, execute `npm run start`.

The server can also be started by executing `node server.js` if the client does
not need to be rebuilt.
