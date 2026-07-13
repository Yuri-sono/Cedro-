const { Client } = require('@stomp/stompjs');
const WebSocket = require('ws');
const fs = require('fs');

const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf-8'));
const WS_URL = 'ws://localhost:8080/ws-chat';

const client = new Client({
  webSocketFactory: () => new WebSocket(`${WS_URL}?token=${tokens.paciente.token}`),
  reconnectDelay: 2000,
  debug: () => {},
});

let primeiraConexao = true;
let reconectou = false;

client.onConnect = () => {
  if (primeiraConexao) {
    console.log('Conectado pela primeira vez. Forcando desconexao em 2s...');
    primeiraConexao = false;
    setTimeout(() => client.forceDisconnect(), 2000);
  } else {
    reconectou = true;
    console.log('PASS: reconectou automaticamente apos queda forcada');
    client.deactivate();
    process.exit(0);
  }
};

client.activate();

setTimeout(() => {
  if (!reconectou) {
    console.log('FAIL: nao reconectou dentro do tempo esperado');
    process.exit(1);
  }
}, 15000);
