const finalhandler = require('finalhandler');
const http = require('http');
const path = require('path');
const serveStatic = require('serve-static');
const url = require('url');
const WebSocket = require('ws');
const log = require('./log.js');
const MessageHandler = require('./message-handler.js');

// Server class handles the http and websocket servers and keeps tabs on the
// connected clients.
class Server {
  constructor(props) {
    this.bind_address = process.env.BIND_ADDRESS;
    if (!this.bind_address) {
      this.bind_address = '127.0.0.1';
    }

    this.bind_port = process.env.BIND_PORT;
    if (!this.bind_port) {
      this.bind_port = 8080;
    }

    this.static_root = path.join(__dirname, 'dist');

    this.next_socket_id = 1;
    this.next_guest_id = 1;

    this.messageHandler = new MessageHandler(this);

    this.clients = [];
  }

  // start actually launches the server so that it listens for connections
  // and handles new clients.  An instantiated Server object is not
  // available until start() has been called.
  start() {
    let addr = this.bind_address;
    let port = this.bind_port;

    // a handler to serve the static content of this app
    let serveStaticFiles = serveStatic(this.static_root);

    // create the http server
    this.server = http.createServer((req, res) => {
      serveStaticFiles(req, res, finalhandler(req, res));
    });

    // create the websocket server
    this.wsServer = new WebSocket.Server({noServer: true});

    // handler function for new websocket connections
    this.wsServer.on('connection', (ws, req) => {

      // initiate a few values
      ws.authenticated = false;
      ws.id = this.next_socket_id++;
      ws.ip = req.connection.remoteAddress;
      ws.log_tag = `[Socket-${ws.id} ${ws.ip}]`;

      log.info(`${ws.log_tag} connection opened`);

      // setup the message handling
      ws.on('message', msg => {
        let msgData = null;
        try {
          msgData = JSON.parse(msg);
        }
        catch (e) {
          log.warn(`${ws.log_tag} invalid JSON received: ${msg}`);
        }
        if (msgData) {
          this.messageHandler.handle(ws, msgData);
        }
      });

      // handler function for websocket disconnect
      ws.on('close', (...args) => {
        let logStr = `${ws.log_tag} socket closed`;
        if (args.length > 0) {
          logStr += ` (${args.join('; ')})`;
        }
        log.info(logStr);
        if (ws.client) {
          ws.client.close();
        }
      });

      // create a Client object for the new connection
      let client = new Client(this, ws);
      this.clients.push(client);

      // send the new Client their identity
      client.sendIdentity();
    });

    // have upgrade requests on http server passed to websocket server
    this.server.on('upgrade', (request, socket, head) => {
      let path = url.parse(request.url).pathname;

      if (path == '/ws') {
        this.wsServer.handleUpgrade(request, socket, head, ws => {
          this.wsServer.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });

    // start listening on the http server port
    this.server.listen(port, addr, () => {
      log.info(`Server running at http://${addr}:${port}/`);
    })

  }

  generateNickname() {
    let existingNicks = this.clients.map(c => { return c.nickname; })
    let nickname = 'guest' + this.next_guest_id++;
    while (existingNicks.indexOf(nickname) != -1) {
      nickname = 'guest' + this.next_guest_id++;
    }
    return nickname;
  }
}

// Client objects represent connected clients.   They have websockets
// associated with them which can be used to send them messages.  They
// contain general data for a connected client that doesn't belong
// anywhere else.
class Client {
  constructor(server, ws) {
    this.server = server;
    this.ws = ws;
    ws.client = this;
    this.nickname = server.generateNickname();
    log.info(`new client (${this.nickname})`);
  }

  close() {
    log.info(`client disconnect (${this.nickname})`);
    this.ws = null;
    let index = this.server.clients.indexOf(this);
    if (index != -1) {
      this.server.clients.splice(index, 1);
    }
  }

  // sendIdentity sends the client its identity (nickname, etc), which
  // is necessary after a new connection is established
  sendIdentity() {
    this.ws.sendJSON({
      'action': 'identity',
      'nickname': this.nickname
    });
  }
}

// sendJSON stringifies passed objects and writes them to the websocket
WebSocket.prototype.sendJSON = function(data, ack) {
  this.send(JSON.stringify(data), ack);
};

// instantiate and start a new Server
let server = new Server();
server.start();
