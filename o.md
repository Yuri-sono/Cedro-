Faz total sentido — modelo local mais fraco precisa de tarefas atômicas, sem ambiguidade, e de preferência só **executando código que eu já escrevi**, não criando lógica do zero (é aí que modelo fraco costuma quebrar tudo). Vou te dar os scripts prontos e você entrega em pedaços pequenos pro Qwen, um de cada vez.

**Regra pra você seguir:** manda **uma tarefa por vez**, espera ela rodar e confirmar o resultado, só depois manda a próxima. Não cola a lista inteira de uma vez.

---

### TAREFA 1 — Preparar a pasta

```
Crie a pasta scripts/teste-stomp/ na raiz do projeto.
Dentro dela, rode exatamente estes comandos, nesta ordem:
npm init -y
npm install @stomp/stompjs ws node-fetch@2

Não crie nenhum arquivo .js ainda. Só confirme que o npm install terminou sem erro.
```

---

### TAREFA 2 — Script de login (gera os tokens)

```
Crie o arquivo scripts/teste-stomp/login.js com EXATAMENTE este conteúdo,
sem alterar nada:

const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';

const usuarios = [
  { nome: 'Teste Paciente', email: 'teste.paciente@cedroplus.dev', senha: 'Teste123!', tipoUsuario: 'paciente' },
  { nome: 'Teste Psicologo', email: 'teste.psicologo@cedroplus.dev', senha: 'Teste123!', tipoUsuario: 'psicologo' },
];

async function loginOuRegistrar(usuario) {
  let res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usuario.email, senha: usuario.senha }),
  });

  if (res.ok) return res.json();

  const resReg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!resReg.ok) {
    const erro = await resReg.text();
    throw new Error(`Falha ao registrar ${usuario.email}: ${erro}`);
  }

  res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usuario.email, senha: usuario.senha }),
  });

  if (!res.ok) throw new Error(`Falha ao logar ${usuario.email} apos registro`);
  return res.json();
}

(async () => {
  const resultado = {};
  for (const usuario of usuarios) {
    console.log(`Autenticando ${usuario.email}...`);
    const data = await loginOuRegistrar(usuario);
    resultado[usuario.tipoUsuario] = {
      token: data.token,
      id: data.usuario.id,
      email: usuario.email,
    };
    console.log(`OK: ${usuario.email} -> id=${resultado[usuario.tipoUsuario].id}`);
  }
  fs.writeFileSync('tokens.json', JSON.stringify(resultado, null, 2));
  console.log('\nTokens salvos em tokens.json');
})().catch((err) => {
  console.error('ERRO:', err.message);
  process.exit(1);
});

Depois de criar o arquivo, rode dentro de scripts/teste-stomp/:
node login.js

Me mostre a saída completa do terminal.
```

**Importante:** se o campo `data.usuario.id` der erro (undefined), pode ser que o JSON de resposta do login use outro nome de campo. Se isso acontecer, me chama que eu ajusto o script — não deixa o Qwen "adivinhar" a correção sozinho.

---

### TAREFA 3 — Teste de chat (as duas direções)

```
Crie o arquivo scripts/teste-stomp/chat-test.js com EXATAMENTE este conteúdo:

const { Client } = require('@stomp/stompjs');
const WebSocket = require('ws');
const fs = require('fs');

const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf-8'));
const WS_URL = 'ws://localhost:8080/ws-chat';

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
    }, 5000);

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
        }, 500);
      };
      clientRemetente.activate();
    };

    clientDestinatario.activate();
  });
}

(async () => {
  console.log('=== TESTE 1: Paciente -> Psicologo ===');
  const teste1 = await testarEnvio(tokens.paciente, tokens.psicologo, 'Teste automatico 1');
  console.log(teste1 ? 'PASS' : 'FAIL');

  console.log('\n=== TESTE 2: Psicologo -> Paciente ===');
  const teste2 = await testarEnvio(tokens.psicologo, tokens.paciente, 'Teste automatico 2');
  console.log(teste2 ? 'PASS' : 'FAIL');

  console.log('\n=== RESUMO ===');
  console.log(`[${teste1 ? 'PASS' : 'FAIL'}] Paciente -> Psicologo`);
  console.log(`[${teste2 ? 'PASS' : 'FAIL'}] Psicologo -> Paciente`);
  process.exit(0);
})();

Rode: node chat-test.js
Me mostre a saída completa.
```

---

### TAREFA 4 — Teste de token inválido

```
Crie o arquivo scripts/teste-stomp/invalid-token-test.js com EXATAMENTE este conteúdo:

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

Rode: node invalid-token-test.js
Me mostre a saída completa.
```

---

### TAREFA 5 — Teste de reconexão automática

```
Crie o arquivo scripts/teste-stomp/reconnect-test.js com EXATAMENTE este conteúdo:

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

Rode: node reconnect-test.js
Me mostre a saída completa.
```

---

### TAREFA 6 — Resumo final

```
Depois de rodar as 4 tarefas acima, me responda só com este resumo:

login.js: OK ou ERRO (qual erro)
chat-test.js: PASS/FAIL em cada teste
invalid-token-test.js: PASS/FAIL
reconnect-test.js: PASS/FAIL
```

Lembra de deixar o backend (`java -jar target\cedro-backend-0.0.1-SNAPSHOT.jar`) rodando em outro terminal antes de começar a Tarefa 2. Me manda os resultados conforme forem saindo — se travar em algum teste eu já te ajudo a debugar ali mesmo, sem precisar mexer no resto.