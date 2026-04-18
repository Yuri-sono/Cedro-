-- =============================================
-- Script: Atualizacao Cedro
-- Banco: cedro (SQL Server)
-- =============================================

USE cedro;
GO

-- Adicionar coluna CRP (registro profissional do psicólogo)
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'crp'
)
BEGIN
    ALTER TABLE usuarios ADD crp VARCHAR(20) NULL;
    PRINT 'Coluna crp adicionada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Coluna crp já existe.';
END
GO
