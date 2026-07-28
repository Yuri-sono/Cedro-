const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const ENV_PATH = path.join('..', '..', 'backend', 'cedro-backend', '.env');

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

const DELETE_SQL = `
DECLARE @anaId    INT = (SELECT id FROM usuarios WHERE email = 'ana.demo@cedroplus.demo');
DECLARE @carlosId INT = (SELECT id FROM usuarios WHERE email = 'carlos.demo@cedroplus.demo');
DECLARE @juliaId  INT = (SELECT id FROM usuarios WHERE email = 'julia.demo@cedroplus.demo');

DELETE FROM sessoes
WHERE psicologo_id IN (@anaId, @carlosId, @juliaId)
  AND id NOT IN (
      SELECT MIN(id)
      FROM sessoes
      WHERE psicologo_id IN (@anaId, @carlosId, @juliaId)
      GROUP BY paciente_id, psicologo_id, data_sessao, status_sessao
  );
`;

(async () => {
  console.log('Lendo .env em:', ENV_PATH);
  const env = lerEnv(ENV_PATH);

  const { server, port, database } = parseJdbcUrl(env.DATABASE_URL);
  console.log(`Conectando em ${server}:${port}, database=${database}...`);

  const pool = await sql.connect({
    server,
    port,
    database,
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    options: { encrypt: true, trustServerCertificate: true },
  });

  console.log('Conectado! Contando sessoes demo ANTES do delete...');
  const antes = await pool.request().query(`
    SELECT COUNT(*) AS total FROM sessoes s
    INNER JOIN usuarios u ON s.psicologo_id = u.id
    WHERE u.email LIKE '%@cedroplus.demo'
  `);
  console.log('Total ANTES:', antes.recordset[0].total);

  console.log('\nExecutando DELETE das duplicatas...');
  const resultado = await pool.request().query(DELETE_SQL);
  console.log('Linhas removidas:', resultado.rowsAffected[resultado.rowsAffected.length - 1]);

  console.log('\nContando sessoes demo DEPOIS do delete...');
  const depois = await pool.request().query(`
    SELECT COUNT(*) AS total FROM sessoes s
    INNER JOIN usuarios u ON s.psicologo_id = u.id
    WHERE u.email LIKE '%@cedroplus.demo'
  `);
  console.log('Total DEPOIS:', depois.recordset[0].total);

  if (depois.recordset[0].total === 8) {
    console.log('\nPASS: exatamente 8 sessoes demo restantes, como esperado.');
  } else {
    console.log('\nATENCAO: esperava 8, encontrou', depois.recordset[0].total, '- revise manualmente.');
  }

  await pool.close();
  process.exit(0);
})().catch((err) => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
