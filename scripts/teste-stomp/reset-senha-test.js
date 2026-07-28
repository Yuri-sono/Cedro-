const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const LOG_PATH = path.join('..', '..', 'backend', 'cedro-backend', 'backend.log');
// Ajuste o caminho acima se o backend.log estiver em outro lugar.

const EMAIL_TESTE = 'teste.paciente@cedroplus.dev';
const SENHA_ATUAL = 'Teste123!';
const SENHA_NOVA = 'NovaSenha456!';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function lerUltimasLinhasLog(quantidade = 50) {
  if (!fs.existsSync(LOG_PATH)) {
    throw new Error(`Arquivo de log nao encontrado em: ${LOG_PATH}`);
  }
  const conteudo = fs.readFileSync(LOG_PATH, 'utf-8');
  const linhas = conteudo.split('\n');
  return linhas.slice(-quantidade).join('\n');
}

function extrairTokenDoLog(logTexto) {
  const match = logTexto.match(/redefinir-senha\?token=([a-zA-Z0-9\-_.]+)/);
  return match ? match[1] : null;
}

async function login(email, senha) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

async function solicitarRecuperacao(email) {
  const res = await fetch(`${BASE_URL}/api/auth/recuperar-senha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

async function redefinirSenha(token, novaSenha) {
  const res = await fetch(`${BASE_URL}/api/auth/redefinir-senha`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, novaSenha }),
  });
  return { ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) };
}

(async () => {
  const resultados = {};

  console.log('=== PASSO 1: Solicitar recuperacao de senha ===');
  const recuperacao = await solicitarRecuperacao(EMAIL_TESTE);
  console.log('Resposta:', recuperacao.body);
  resultados.solicitacao = recuperacao.ok;

  console.log('\n=== PASSO 2: Ler o link do log do backend ===');
  await sleep(1000);
  const log = lerUltimasLinhasLog();
  const token = extrairTokenDoLog(log);
  if (!token) {
    console.log('FAIL: nao encontrou token/link no log. Ultimas linhas lidas:');
    console.log(log);
    process.exit(1);
  }
  console.log('Token encontrado:', token);
  resultados.tokenEncontrado = true;

  console.log('\n=== PASSO 3: Redefinir senha com o token ===');
  const redefinicao = await redefinirSenha(token, SENHA_NOVA);
  console.log('Resposta:', redefinicao.body, '| status:', redefinicao.status);
  resultados.redefinicao = redefinicao.ok;

  console.log('\n=== PASSO 4: Logar com a senha NOVA (deve funcionar) ===');
  const loginNovaSenha = await login(EMAIL_TESTE, SENHA_NOVA);
  console.log('Status:', loginNovaSenha.status);
  resultados.loginComSenhaNova = loginNovaSenha.ok;

  console.log('\n=== PASSO 5: Reusar o MESMO token (deve falhar) ===');
  const reuso = await redefinirSenha(token, 'OutraSenha789!');
  console.log('Status:', reuso.status, '| Resposta:', reuso.body);
  resultados.tokenRejeitadoNoReuso = !reuso.ok;

  console.log('\n=== RESUMO ===');
  console.log(`[${resultados.solicitacao ? 'PASS' : 'FAIL'}] Solicitacao de recuperacao aceita`);
  console.log(`[${resultados.tokenEncontrado ? 'PASS' : 'FAIL'}] Token encontrado no log`);
  console.log(`[${resultados.redefinicao ? 'PASS' : 'FAIL'}] Senha redefinida com token valido`);
  console.log(`[${resultados.loginComSenhaNova ? 'PASS' : 'FAIL'}] Login com senha nova`);
  console.log(`[${resultados.tokenRejeitadoNoReuso ? 'PASS' : 'FAIL'}] Token reusado foi rejeitado`);

  const tudoPasso = Object.values(resultados).every(Boolean);
  process.exit(tudoPasso ? 0 : 1);
})().catch((err) => {
  console.error('ERRO INESPERADO:', err.message);
  process.exit(1);
});
