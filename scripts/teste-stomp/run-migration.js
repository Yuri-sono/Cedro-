const fs = require('fs');
const path = require('path');
const sql = require('mssql');

// Ajuste este caminho se a estrutura de pastas for diferente na sua máquina
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
  // Exemplo esperado: jdbc:sqlserver://CedroDB.mssql.somee.com:1433;databaseName=CedroDB;...
  const match = jdbcUrl.match(/jdbc:sqlserver:\/\/([^:;]+):?(\d+)?;/i);
  if (!match) throw new Error('Nao foi possivel interpretar DATABASE_URL: ' + jdbcUrl);
  const server = match[1];
  const port = match[2] ? parseInt(match[2], 10) : 1433;

  const dbMatch = jdbcUrl.match(/databaseName=([^;]+)/i);
  const database = dbMatch ? dbMatch[1] : undefined;

  return { server, port, database };
}

const MIGRATION_SQL = `
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='password_reset_tokens' AND xtype='U')
BEGIN
    CREATE TABLE password_reset_tokens (
        id INT IDENTITY PRIMARY KEY,
        usuario_id INT NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expira_em DATETIME NOT NULL,
        usado BIT DEFAULT 0,
        data_criacao DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_password_reset_usuario FOREIGN KEY (usuario_id)
            REFERENCES usuarios(id) ON DELETE CASCADE
    );
END
`;

(async () => {
  console.log('Lendo .env em:', ENV_PATH);
  const env = lerEnv(ENV_PATH);

  if (!env.DATABASE_URL || !env.DATABASE_USERNAME || !env.DATABASE_PASSWORD) {
    throw new Error('DATABASE_URL, DATABASE_USERNAME ou DATABASE_PASSWORD nao encontrados no .env');
  }

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

  console.log('Conectado! Executando migration...');
  await pool.request().batch(MIGRATION_SQL);
  console.log('Migration executada com sucesso.');

  const resultado = await pool.request().query('SELECT COUNT(*) AS total FROM password_reset_tokens');
  console.log('Tabela confirmada. Total de linhas atualmente:', resultado.recordset[0].total);

  await pool.close();
  process.exit(0);
})().catch((err) => {
  console.error('ERRO:', err.message);
  process.exit(1);
});
