
module.exports = (server, ws, msg) => {
  ws.sendJSON({
    action: 'pong',
    ts: msg.ts
  });
}
