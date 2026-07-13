const { Client } = require('@stomp/stompjs');
const WebSocket = require('ws');

const WS_URL = 'ws://localhost:8080/ws-chat';

const client = new Client({
  webSocketFactory: () => new WebSocket(`${WS_URL}?token=token_invalido_123`),
  reconnectDelay: 0,
  debug: () => {},
});

let conectou = false;

client.onConnect = () => {
  conectou = true;
  console.log('FAIL: conseguiu conectar com token invalido (nao deveria)');
  client.deactivate();
  process.exit(1);
};

client.onWebSocketClose = () => {
  if (!conectou) {
    console.log('PASS: conexao recusada como esperado (token invalido)');
    process.exit(0);
  }
};

client.activate();

setTimeout(() => {
  if (!conectou) {
    console.log('PASS (timeout): conexao nunca completou com token invalido');
    process.exit(0);
  }
}, 5000);
