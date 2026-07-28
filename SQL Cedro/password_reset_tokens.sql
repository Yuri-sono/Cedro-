-- Idempotente: cria a tabela apenas se não existir
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_NAME = 'password_reset_tokens'
)
BEGIN
    CREATE TABLE password_reset_tokens (
        id          INT IDENTITY(1,1) PRIMARY KEY,
        usuario_id  INT          NOT NULL,
        token       VARCHAR(255) NOT NULL UNIQUE,
        expira_em   DATETIME     NOT NULL,
        usado       BIT          NOT NULL DEFAULT 0,
        data_criacao DATETIME    NOT NULL DEFAULT GETDATE(),
        CONSTRAINT fk_prt_usuario FOREIGN KEY (usuario_id)
            REFERENCES usuarios(id) ON DELETE CASCADE
    );
END
