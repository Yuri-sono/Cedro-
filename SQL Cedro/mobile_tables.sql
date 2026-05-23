-- ============================================
-- SCRIPT SQL - TABELAS MOBILE CEDRO PLUS
-- ============================================
-- Executar no SQL Server: CedroDB.mssql.somee.com
-- Data: 2024
-- ============================================

-- 1️⃣ TABELA: chamadas_historico
-- Armazena histórico de chamadas de voz/vídeo
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'chamadas_historico')
BEGIN
    CREATE TABLE chamadas_historico (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuario_id INT NOT NULL,
        tipo VARCHAR(20) NOT NULL, -- 'voz' ou 'video'
        duracao_segundos INT,
        data_chamada DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
    
    -- Índice para melhorar performance de contagem mensal
    CREATE INDEX idx_chamadas_usuario_data 
    ON chamadas_historico(usuario_id, data_chamada);
    
    PRINT '✅ Tabela chamadas_historico criada com sucesso';
END
ELSE
BEGIN
    PRINT '⚠️ Tabela chamadas_historico já existe';
END
GO

-- 2️⃣ TABELA: assinaturas
-- Armazena assinaturas premium dos usuários
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'assinaturas')
BEGIN
    CREATE TABLE assinaturas (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuario_id INT NOT NULL,
        status VARCHAR(20) NOT NULL, -- 'ativa', 'cancelada', 'expirada'
        plano VARCHAR(50) NOT NULL, -- 'premium_mensal'
        data_inicio DATETIME NOT NULL DEFAULT GETDATE(),
        data_fim DATETIME NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
    
    -- Índice para verificação rápida de status premium
    CREATE INDEX idx_assinaturas_usuario_status 
    ON assinaturas(usuario_id, status, data_fim);
    
    PRINT '✅ Tabela assinaturas criada com sucesso';
END
ELSE
BEGIN
    PRINT '⚠️ Tabela assinaturas já existe';
END
GO

-- 3️⃣ TABELA: push_tokens
-- Armazena tokens de notificações push dos dispositivos
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'push_tokens')
BEGIN
    CREATE TABLE push_tokens (
        id INT PRIMARY KEY IDENTITY(1,1),
        usuario_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        data_registro DATETIME NOT NULL DEFAULT GETDATE(),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );
    
    -- Índice único para evitar tokens duplicados
    CREATE UNIQUE INDEX idx_push_tokens_usuario_token 
    ON push_tokens(usuario_id, token);
    
    PRINT '✅ Tabela push_tokens criada com sucesso';
END
ELSE
BEGIN
    PRINT '⚠️ Tabela push_tokens já existe';
END
GO

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
PRINT '';
PRINT '📊 RESUMO DAS TABELAS:';
PRINT '========================';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'chamadas_historico')
    PRINT '✅ chamadas_historico - OK';
ELSE
    PRINT '❌ chamadas_historico - ERRO';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'assinaturas')
    PRINT '✅ assinaturas - OK';
ELSE
    PRINT '❌ assinaturas - ERRO';

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'push_tokens')
    PRINT '✅ push_tokens - OK';
ELSE
    PRINT '❌ push_tokens - ERRO';

PRINT '';
PRINT '🎉 Script executado com sucesso!';
PRINT '========================';
