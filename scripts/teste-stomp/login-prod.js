const fetch = require('node-fetch');
const fs = require('fs');

const BASE_URL = 'https://cedro-vc32.onrender.com';

const crpAleatorio = '99/' + Math.floor(10000 + Math.random() * 90000);

const usuarios = [
  { nome: 'Teste Paciente', email: 'teste.paciente@cedroplus.dev', senha: 'NovaSenha456!', tipoUsuario: 'paciente' },
  { nome: 'Teste Psicologo', email: 'teste.psicologo@cedroplus.dev', senha: 'Teste123!', tipoUsuario: 'psicologo', crp: crpAleatorio, especialidade: 'Psicologia Clinica', tipoPsicologo: 'Clinico', precoSessao: 150 },
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
    console.log(`Autenticando ${usuario.email} em ${BASE_URL}...`);
    const data = await loginOuRegistrar(usuario);
    resultado[usuario.tipoUsuario] = {
      token: data.token,
      id: data.usuario.id,
      email: usuario.email,
    };
    console.log(`OK: ${usuario.email} -> id=${resultado[usuario.tipoUsuario].id}`);
  }
  fs.writeFileSync('tokens-prod.json', JSON.stringify(resultado, null, 2));
  console.log('\nTokens salvos em tokens-prod.json');
})().catch((err) => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
