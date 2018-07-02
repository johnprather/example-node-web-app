const log = require('./log.js');

var handlers = {};
handlers['ping'] = require('./message-handler/ping.js');

class MessageHandler {
  constructor(server) {
    this.server = server;
  }

  handle(ws, msg) {
    if (typeof(handlers[msg.action]) === 'function') {
      handlers[msg.action](this.server, ws, msg);
    } else {
      log.warn(`${ws.log_tag} unhandled message: ${JSON.stringify(msg)}`);
    }
  }
}

module.exports = MessageHandler;
