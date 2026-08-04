const { Client } = require('@stomp/stompjs');
const WebSocket = require('ws');
const fs = require('fs');

const tokens = JSON.parse(fs.readFileSync('tokens-prod.json', 'utf-8'));
const WS_URL = 'wss://cedro-vc32.onrender.com/ws-chat';

function criarClient(token) {
  return new Client({
    webSocketFactory: () => new WebSocket(`${WS_URL}?token=${token}`),
    reconnectDelay: 3000,
    debug: () => {},
  });
}

async function testarEnvio(remetente, destinatario, mensagemTexto) {
  return new Promise((resolve) => {
    const clientRemetente = criarClient(remetente.token);
    const clientDestinatario = criarClient(destinatario.token);
    let recebeu = false;

    const timeout = setTimeout(() => {
      if (!recebeu) {
        clientRemetente.deactivate();
        clientDestinatario.deactivate();
        resolve(false);
      }
    }, 10000); // timeout maior, Render pode ter latencia extra

    clientDestinatario.onConnect = () => {
      clientDestinatario.subscribe('/user/queue/mensagens', (msg) => {
        console.log('[destinatario] Recebeu:', msg.body);
        recebeu = true;
        clearTimeout(timeout);
        clientRemetente.deactivate();
        clientDestinatario.deactivate();
        resolve(true);
      });

      clientRemetente.onConnect = () => {
        setTimeout(() => {
          clientRemetente.publish({
            destination: '/app/chat.send',
            body: JSON.stringify({ destinatarioId: destinatario.id, mensagem: mensagemTexto }),
          });
        }, 800);
      };
      clientRemetente.activate();
    };

    clientDestinatario.activate();
  });
}

(async () => {
  console.log('=== TESTE 1: Paciente -> Psicologo (PRODUCAO) ===');
  const teste1 = await testarEnvio(tokens.paciente, tokens.psicologo, 'Teste automatico producao 1');
  console.log(teste1 ? 'PASS' : 'FAIL');

  console.log('\n=== TESTE 2: Psicologo -> Paciente (PRODUCAO) ===');
  const teste2 = await testarEnvio(tokens.psicologo, tokens.paciente, 'Teste automatico producao 2');
  console.log(teste2 ? 'PASS' : 'FAIL');

  console.log('\n=== RESUMO ===');
  console.log(`[${teste1 ? 'PASS' : 'FAIL'}] Paciente -> Psicologo`);
  console.log(`[${teste2 ? 'PASS' : 'FAIL'}] Psicologo -> Paciente`);
  process.exit(0);
})();
