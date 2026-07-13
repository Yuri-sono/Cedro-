-- ============================================
-- SCRIPT SQL - TABELAS MOBILE CEDRO
-- Banco: SQL Server / Somee
-- Objetivo: suporte a chamadas, assinatura e push tokens
-- Seguro para reexecutar: cria tabelas apenas se ainda nao existirem.
-- ============================================

SET XACT_ABORT ON;
BEGIN TRAN;

IF OBJECT_ID(N'dbo.chamadas_historico', N'U') IS NULL
BEGIN
    -- Tabela legada mantida apenas para preservar historico existente.
    CREATE TABLE dbo.chamadas_historico (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_chamadas_historico PRIMARY KEY,
        usuario_id INT NOT NULL,
        outro_usuario_id INT NULL,
        channel_name VARCHAR(160) NULL,
        tipo VARCHAR(20) NOT NULL,
        duracao_segundos INT NULL,
        data_chamada DATETIME NOT NULL CONSTRAINT DF_chamadas_data DEFAULT GETDATE(),
        CONSTRAINT FK_chamadas_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id) ON DELETE CASCADE,
        CONSTRAINT CK_chamadas_tipo CHECK (tipo IN ('voz', 'video')),
        CONSTRAINT CK_chamadas_duracao CHECK (duracao_segundos IS NULL OR duracao_segundos >= 0)
    );

    CREATE INDEX IX_chamadas_usuario_data
        ON dbo.chamadas_historico(usuario_id, data_chamada DESC);
END;

IF OBJECT_ID(N'dbo.assinaturas', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.assinaturas (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_assinaturas PRIMARY KEY,
        usuario_id INT NOT NULL,
        status VARCHAR(20) NOT NULL,
        plano VARCHAR(50) NOT NULL,
        revenuecat_app_user_id VARCHAR(100) NULL,
        revenuecat_product_id VARCHAR(100) NULL,
        revenuecat_transaction_id VARCHAR(150) NULL,
        data_inicio DATETIME NOT NULL CONSTRAINT DF_assinaturas_inicio DEFAULT GETDATE(),
        data_fim DATETIME NULL,
        data_criacao DATETIME NOT NULL CONSTRAINT DF_assinaturas_criacao DEFAULT GETDATE(),
        data_atualizacao DATETIME NULL,
        CONSTRAINT FK_assinaturas_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id) ON DELETE CASCADE,
        CONSTRAINT CK_assinaturas_status CHECK (status IN ('ativa', 'cancelada', 'expirada')),
        CONSTRAINT CK_assinaturas_plano CHECK (plano IN ('premium_mensal'))
    );

    CREATE INDEX IX_assinaturas_usuario_status
        ON dbo.assinaturas(usuario_id, status, data_fim);

    CREATE UNIQUE INDEX UX_assinaturas_usuario_ativa
        ON dbo.assinaturas(usuario_id)
        WHERE status = 'ativa';
END;

IF OBJECT_ID(N'dbo.push_tokens', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.push_tokens (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_push_tokens PRIMARY KEY,
        usuario_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        plataforma VARCHAR(20) NULL,
        device_id VARCHAR(120) NULL,
        data_registro DATETIME NOT NULL CONSTRAINT DF_push_tokens_registro DEFAULT GETDATE(),
        data_atualizacao DATETIME NULL,
        CONSTRAINT FK_push_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES dbo.usuarios(id) ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX UX_push_tokens_usuario_token
        ON dbo.push_tokens(usuario_id, token);

    CREATE INDEX IX_push_tokens_usuario
        ON dbo.push_tokens(usuario_id);
END;

COMMIT;
