-- ============================================================================
-- Migração idempotente: disponibilidade de atendimento do psicólogo
-- Tabela: usuarios
-- Coluna dias_atendimento:      dias da semana em que atende.
--     Formato:  "1,2,3,4,5"  (números 0=Domingo a 6=Sábado)
--     Mesmo padrão usado no mobile em WEEKDAY_OPTIONS.
-- Coluna horarios_atendimento: horários disponíveis.
--     Formato:  "08:00,09:00,14:00,15:00"
-- ============================================================================

IF COL_LENGTH('usuarios', 'dias_atendimento') IS NULL
BEGIN
    ALTER TABLE usuarios
        ADD dias_atendimento VARCHAR(50) NULL;
END;

IF COL_LENGTH('usuarios', 'horarios_atendimento') IS NULL
BEGIN
    ALTER TABLE usuarios
        ADD horarios_atendimento VARCHAR(300) NULL;
END;