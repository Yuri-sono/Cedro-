-- Schema Cedro
-- SQL Server

-- Dropar todas as constraints de foreign key primeiro
DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql += 'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys;
EXEC sp_executesql @sql;

-- Dropar tabelas se existirem
IF OBJECT_ID('reproducoes', 'U') IS NOT NULL DROP TABLE reproducoes;
IF OBJECT_ID('downloads', 'U') IS NOT NULL DROP TABLE downloads;
IF OBJECT_ID('mensagens_emergencia', 'U') IS NOT NULL DROP TABLE mensagens_emergencia;
IF OBJECT_ID('emergencias', 'U') IS NOT NULL DROP TABLE emergencias;
IF OBJECT_ID('contatos', 'U') IS NOT NULL DROP TABLE contatos;
IF OBJECT_ID('presenca_grupo', 'U') IS NOT NULL DROP TABLE presenca_grupo;
IF OBJECT_ID('sessoes_grupo', 'U') IS NOT NULL DROP TABLE sessoes_grupo;
IF OBJECT_ID('participantes_grupos', 'U') IS NOT NULL DROP TABLE participantes_grupos;
IF OBJECT_ID('grupos_terapia', 'U') IS NOT NULL DROP TABLE grupos_terapia;
IF OBJECT_ID('inscricoes_webinars', 'U') IS NOT NULL DROP TABLE inscricoes_webinars;
IF OBJECT_ID('webinars', 'U') IS NOT NULL DROP TABLE webinars;
IF OBJECT_ID('meditacoes', 'U') IS NOT NULL DROP TABLE meditacoes;
IF OBJECT_ID('ebooks', 'U') IS NOT NULL DROP TABLE ebooks;
IF OBJECT_ID('autoavaliacoes', 'U') IS NOT NULL DROP TABLE autoavaliacoes;
IF OBJECT_ID('mensagens', 'U') IS NOT NULL DROP TABLE mensagens;
IF OBJECT_ID('avaliacoes', 'U') IS NOT NULL DROP TABLE avaliacoes;
IF OBJECT_ID('pagamentos', 'U') IS NOT NULL DROP TABLE pagamentos;
IF OBJECT_ID('sessoes', 'U') IS NOT NULL DROP TABLE sessoes;
IF OBJECT_ID('usuarios', 'U') IS NOT NULL DROP TABLE usuarios;

-- Tabela de Usuários (Pacientes, Psicólogos e Admin)
CREATE TABLE usuarios (
    id INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_nascimento DATE,
    genero VARCHAR(20),
    endereco VARCHAR(200),
    bio TEXT,
    tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'paciente', -- 'paciente', 'psicologo', 'admin'
    especialidade VARCHAR(100), -- Apenas para psicólogos
    preco_sessao DECIMAL(10,2), -- Apenas para psicólogos
    avaliacao DECIMAL(3,2) DEFAULT 5.0, -- Apenas para psicólogos
    foto_url VARCHAR(255),
    ativo BIT DEFAULT 1,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Sessões
CREATE TABLE sessoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    paciente_id INT NOT NULL,
    psicologo_id INT NOT NULL,
    data_sessao DATETIME NOT NULL,
    duracao INT DEFAULT 60, -- em minutos
    valor DECIMAL(10,2) NOT NULL,
    status_sessao VARCHAR(20) DEFAULT 'agendada', -- 'agendada', 'realizada', 'cancelada'
    observacoes TEXT,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Pagamentos
CREATE TABLE pagamentos (
    id INT PRIMARY KEY IDENTITY(1,1),
    sessao_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    status_pagamento VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'pago', 'cancelado'
    metodo_pagamento VARCHAR(50), -- 'pix', 'cartao', 'boleto'
    data_pagamento DATETIME,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Avaliações
CREATE TABLE avaliacoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    sessao_id INT NOT NULL,
    paciente_id INT NOT NULL,
    psicologo_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Mensagens (Chat)
CREATE TABLE mensagens (
    id INT PRIMARY KEY IDENTITY(1,1),
    remetente_id INT NOT NULL,
    destinatario_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    lida BIT DEFAULT 0,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Autoavaliações
CREATE TABLE autoavaliacoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuario_id INT NOT NULL,
    pontuacao INT NOT NULL,
    nivel VARCHAR(50) NOT NULL,
    respostas TEXT, -- JSON com as respostas
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de E-books
CREATE TABLE ebooks (
    id INT PRIMARY KEY IDENTITY(1,1),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    paginas INT,
    arquivo_url VARCHAR(255),
    capa_url VARCHAR(255),
    downloads INT DEFAULT 0,
    ativo BIT DEFAULT 1,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Meditações
CREATE TABLE meditacoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    duracao INT NOT NULL, -- em minutos
    nivel VARCHAR(20), -- 'Iniciante', 'Intermediário', 'Avançado'
    audio_url VARCHAR(255),
    reproducoes INT DEFAULT 0,
    ativo BIT DEFAULT 1,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Webinars
CREATE TABLE webinars (
    id INT PRIMARY KEY IDENTITY(1,1),
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    palestrante VARCHAR(100),
    data_webinar DATETIME NOT NULL,
    duracao INT, -- em minutos
    link_transmissao VARCHAR(255),
    video_url VARCHAR(255), -- para webinars gravados
    status VARCHAR(20) DEFAULT 'agendado', -- 'agendado', 'ao_vivo', 'finalizado'
    vagas INT,
    inscritos INT DEFAULT 0,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Inscrições em Webinars
CREATE TABLE inscricoes_webinars (
    id INT PRIMARY KEY IDENTITY(1,1),
    webinar_id INT NOT NULL,
    usuario_id INT NOT NULL,
    presente BIT DEFAULT 0,
    data_inscricao DATETIME DEFAULT GETDATE()
);

-- Tabela de Grupos de Terapia
CREATE TABLE grupos_terapia (
    id INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    psicologo_id INT NOT NULL,
    horario VARCHAR(50),
    dia_semana VARCHAR(20),
    vagas_total INT DEFAULT 8,
    vagas_disponiveis INT DEFAULT 8,
    preco_sessao DECIMAL(10,2),
    ativo BIT DEFAULT 1,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Participantes de Grupos
CREATE TABLE participantes_grupos (
    id INT PRIMARY KEY IDENTITY(1,1),
    grupo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo', -- 'ativo', 'inativo', 'concluido'
    data_entrada DATETIME DEFAULT GETDATE(),
    data_saida DATETIME
);

-- Tabela de Sessões de Grupo
CREATE TABLE sessoes_grupo (
    id INT PRIMARY KEY IDENTITY(1,1),
    grupo_id INT NOT NULL,
    data_sessao DATETIME NOT NULL,
    tema VARCHAR(200),
    observacoes TEXT,
    status VARCHAR(20) DEFAULT 'agendada',
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Presença em Sessões de Grupo
CREATE TABLE presenca_grupo (
    id INT PRIMARY KEY IDENTITY(1,1),
    sessao_grupo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    presente BIT DEFAULT 0
);

-- Tabela de Contatos/Mensagens de Suporte
CREATE TABLE contatos (
    id INT PRIMARY KEY IDENTITY(1,1),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    assunto VARCHAR(200),
    mensagem TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'em_atendimento', 'resolvido'
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Emergências/Chat de Emergência
CREATE TABLE emergencias (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuario_id INT NOT NULL,
    descricao TEXT NOT NULL,
    nivel_urgencia VARCHAR(20) DEFAULT 'media', -- 'baixa', 'media', 'alta', 'critica'
    status VARCHAR(20) DEFAULT 'aberto', -- 'aberto', 'em_atendimento', 'resolvido'
    atendente_id INT,
    data_criacao DATETIME DEFAULT GETDATE(),
    data_resolucao DATETIME
);

-- Tabela de Mensagens de Emergência
CREATE TABLE mensagens_emergencia (
    id INT PRIMARY KEY IDENTITY(1,1),
    emergencia_id INT NOT NULL,
    remetente_id INT NOT NULL,
    mensagem TEXT NOT NULL,
    data_criacao DATETIME DEFAULT GETDATE()
);

-- Tabela de Histórico de Downloads
CREATE TABLE downloads (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuario_id INT NOT NULL,
    ebook_id INT NOT NULL,
    data_download DATETIME DEFAULT GETDATE()
);

-- Tabela de Histórico de Reproduções
CREATE TABLE reproducoes (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuario_id INT NOT NULL,
    meditacao_id INT NOT NULL,
    duracao_assistida INT, -- em minutos
    concluida BIT DEFAULT 0,
    data_reproducao DATETIME DEFAULT GETDATE()
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX idx_sessoes_paciente ON sessoes(paciente_id);
CREATE INDEX idx_sessoes_psicologo ON sessoes(psicologo_id);
CREATE INDEX idx_sessoes_data ON sessoes(data_sessao);
CREATE INDEX idx_sessoes_status ON sessoes(status_sessao);
CREATE INDEX idx_mensagens_remetente ON mensagens(remetente_id);
CREATE INDEX idx_mensagens_destinatario ON mensagens(destinatario_id);
CREATE INDEX idx_autoavaliacoes_usuario ON autoavaliacoes(usuario_id);
CREATE INDEX idx_grupos_psicologo ON grupos_terapia(psicologo_id);
CREATE INDEX idx_webinars_data ON webinars(data_webinar);
CREATE INDEX idx_emergencias_status ON emergencias(status);
CREATE INDEX idx_pagamentos_status ON pagamentos(status_pagamento);


SELECT*from usuarios