const fs = require('fs');
const path = require('path');
const sql = require('mssql');

// Caminhos relativos a partir de scripts/teste-stomp/
const ENV_PATH = path.join('..', '..', 'backend', 'cedro-backend', '.env');
const SQL_PATH = path.join('..', '..', 'SQL Cedro', 'dados_demo_apresentacao.sql');

function lerEnv(caminho) {
  const conteudo = fs.readFileSync(caminho, 'utf-8');
  const vars = {};
  conteudo.split('\n').forEach((linha) => {
    const match = linha.match(/^\s*([^#][^=]*)=(.*)$/);
    if (match) {
      vars[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
  return vars;
}

function parseJdbcUrl(jdbcUrl) {
  const match = jdbcUrl.match(/jdbc:sqlserver:\/\/([^:;]+):?(\d+)?;/i);
  if (!match) throw new Error('Nao foi possivel interpretar DATABASE_URL: ' + jdbcUrl);
  const server = match[1];
  const port = match[2] ? parseInt(match[2], 10) : 1433;
  const dbMatch = jdbcUrl.match(/databaseName=([^;]+)/i);
  const database = dbMatch ? dbMatch[1] : undefined;
  return { server, port, database };
}

function dividirEmLotesGO(sqlTexto) {
  // Divide o script em lotes separados por linhas que contêm só "GO" (case-insensitive)
  const linhas = sqlTexto.split(/\r?\n/);
  const lotes = [];
  let loteAtual = [];

  for (const linha of linhas) {
    if (/^\s*GO\s*$/i.test(linha)) {
      if (loteAtual.length > 0) {
        lotes.push(loteAtual.join('\n'));
        loteAtual = [];
      }
    } else {
      loteAtual.push(linha);
    }
  }
  if (loteAtual.length > 0) lotes.push(loteAtual.join('\n'));

  return lotes.filter((lote) => lote.trim().length > 0);
}

(async () => {
  console.log('Lendo .env em:', ENV_PATH);
  const env = lerEnv(ENV_PATH);

  if (!env.DATABASE_URL || !env.DATABASE_USERNAME || !env.DATABASE_PASSWORD) {
    throw new Error('DATABASE_URL, DATABASE_USERNAME ou DATABASE_PASSWORD nao encontrados no .env');
  }

  console.log('Lendo script SQL em:', SQL_PATH);
  const sqlTexto = fs.readFileSync(SQL_PATH, 'utf-8');
  const lotes = dividirEmLotesGO(sqlTexto);
  console.log(`Script dividido em ${lotes.length} lote(s) (separados por GO, se houver).`);

  const { server, port, database } = parseJdbcUrl(env.DATABASE_URL);
  console.log(`Conectando em ${server}:${port}, database=${database}...`);

  const pool = await sql.connect({
    server,
    port,
    database,
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  });

  console.log('Conectado! Executando o seed...\n');

  for (let i = 0; i < lotes.length; i++) {
    console.log(`--- Executando lote ${i + 1}/${lotes.length} ---`);
    try {
      const resultado = await pool.request().batch(lotes[i]);
      if (resultado.recordset) {
        console.log('Resultado:', JSON.stringify(resultado.recordset));
      }
      console.log(`Lote ${i + 1} executado com sucesso.`);
    } catch (err) {
      console.error(`ERRO no lote ${i + 1}:`, err.message);
      console.error('Conteudo do lote que falhou:\n', lotes[i].substring(0, 500));
      throw err;
    }
  }

  console.log('\n=== Seed concluido. Verificando dados... ===');
  const psicologos = await pool.request().query(
    "SELECT id, nome, email FROM usuarios WHERE email LIKE '%@cedroplus.demo' AND tipo_usuario = 'psicologo'"
  );
  console.log(`Psicologos demo encontrados: ${psicologos.recordset.length}`);
  console.table(psicologos.recordset);

  const pacientes = await pool.request().query(
    "SELECT id, nome, email FROM usuarios WHERE email LIKE '%@cedroplus.demo' AND tipo_usuario = 'paciente'"
  );
  console.log(`Pacientes demo encontrados: ${pacientes.recordset.length}`);
  console.table(pacientes.recordset);

  const sessoes = await pool.request().query(`
    SELECT s.id, s.status_sessao, s.data_sessao, s.link_reuniao
    FROM sessoes s
    INNER JOIN usuarios u ON s.paciente_id = u.id
    WHERE u.email LIKE '%@cedroplus.demo'
  `);
  console.log(`Sessoes demo encontradas: ${sessoes.recordset.length}`);
  console.table(sessoes.recordset);

  const mensagens = await pool.request().query(`
    SELECT COUNT(*) AS total FROM mensagens m
    INNER JOIN usuarios u ON m.remetente_id = u.id
    WHERE u.email LIKE '%@cedroplus.demo'
  `);
  console.log(`Mensagens demo encontradas: ${mensagens.recordset[0].total}`);

  await pool.close();
  process.exit(0);
})().catch((err) => {
  console.error('\nERRO FATAL:', err.message);
  process.exit(1);
});