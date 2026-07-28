-- ============================================================
-- Cedro Plus — Dados de Demonstração para Apresentação TCC
-- Idempotente: verifica existência antes de inserir.
-- Nomes claramente fictícios (sufixo "Demo" / "Demonstração").
-- ============================================================

-- ── 0. GARANTIR COLUNAS GOOGLE MEET ─────────────────────────
IF COL_LENGTH('sessoes', 'link_reuniao') IS NULL
BEGIN
    ALTER TABLE sessoes ADD link_reuniao VARCHAR(255) NULL;
END;

IF COL_LENGTH('sessoes', 'google_event_id') IS NULL
BEGIN
    ALTER TABLE sessoes ADD google_event_id VARCHAR(255) NULL;
END;
GO

-- ── 1. PSICÓLOGOS DEMO ──────────────────────────────────────
-- Senha demo: Cedro@123  (bcrypt gerado offline)
DECLARE @hash VARCHAR(255) = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjefYRIs1WlsqRQqTvNv3euKB4s1aGy';

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'ana.demo@cedroplus.demo')
INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, genero,
                      tipo_usuario, especialidade, tipo_psicologo, crp,
                      preco_sessao, avaliacao, bio, foto_url, ativo)
VALUES ('Dra. Ana Demonstração', 'ana.demo@cedroplus.demo', @hash,
        '11900000001', '1985-03-12', 'feminino',
        'psicologo', 'Ansiedade e Depressão', 'TCC',
        '06/100001', 150.00, 4.9,
        'Psicóloga clínica com 12 anos de experiência em Terapia Cognitivo-Comportamental. Atende adultos com foco em ansiedade, depressão e autoestima.',
        'https://ui-avatars.com/api/?name=Ana+Demo&background=4CAF50&color=fff&size=200',
        1);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'carlos.demo@cedroplus.demo')
INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, genero,
                      tipo_usuario, especialidade, tipo_psicologo, crp,
                      preco_sessao, avaliacao, bio, foto_url, ativo)
VALUES ('Dr. Carlos Demonstração', 'carlos.demo@cedroplus.demo', @hash,
        '11900000002', '1980-07-22', 'masculino',
        'psicologo', 'Relacionamentos e Família', 'Terapia de Casal',
        '06/100002', 180.00, 4.7,
        'Especialista em terapia de casais e dinâmica familiar. Abordagem sistêmica com foco em comunicação e vínculos afetivos.',
        'https://ui-avatars.com/api/?name=Carlos+Demo&background=2196F3&color=fff&size=200',
        1);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'julia.demo@cedroplus.demo')
INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, genero,
                      tipo_usuario, especialidade, tipo_psicologo, crp,
                      preco_sessao, avaliacao, bio, foto_url, ativo)
VALUES ('Dra. Júlia Demonstração', 'julia.demo@cedroplus.demo', @hash,
        '11900000003', '1990-11-05', 'feminino',
        'psicologo', 'Trauma e Burnout', 'EMDR',
        '06/100003', 200.00, 5.0,
        'Especialista em trauma, burnout e estresse pós-traumático. Certificada em EMDR e Mindfulness-Based Stress Reduction.',
        'https://ui-avatars.com/api/?name=Julia+Demo&background=9C27B0&color=fff&size=200',
        1);

-- ── 2. PACIENTES DEMO ───────────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'paciente1.demo@cedroplus.demo')
INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, genero,
                      tipo_usuario, area_interesse, bio, ativo)
VALUES ('Paciente Teste Silva', 'paciente1.demo@cedroplus.demo', @hash,
        '11900000010', '1995-06-18', 'masculino',
        'paciente', 'TCC,ansiedade',
        'Paciente de demonstração — perfil completo para apresentação.',
        1);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'paciente2.demo@cedroplus.demo')
INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, genero,
                      tipo_usuario, area_interesse, bio, ativo)
VALUES ('Paciente Demo Oliveira', 'paciente2.demo@cedroplus.demo', @hash,
        '11900000011', '1992-09-30', 'feminino',
        'paciente', 'Terapia de Casal',
        'Paciente de demonstração — perfil completo para apresentação.',
        1);

-- ── 3. SESSÕES DEMO ─────────────────────────────────────────
-- Captura IDs dos usuários demo
DECLARE @anaId    INT = (SELECT id FROM usuarios WHERE email = 'ana.demo@cedroplus.demo');
DECLARE @carlosId INT = (SELECT id FROM usuarios WHERE email = 'carlos.demo@cedroplus.demo');
DECLARE @juliaId  INT = (SELECT id FROM usuarios WHERE email = 'julia.demo@cedroplus.demo');
DECLARE @pac1Id   INT = (SELECT id FROM usuarios WHERE email = 'paciente1.demo@cedroplus.demo');
DECLARE @pac2Id   INT = (SELECT id FROM usuarios WHERE email = 'paciente2.demo@cedroplus.demo');

-- Helper: converte data atual para DATETIME com hora zerada
DECLARE @hoje DATETIME = CAST(CAST(GETDATE() AS DATE) AS DATETIME);

-- 2 sessões REALIZADAS (passado)
IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac1Id AND psicologo_id = @anaId AND data_sessao = DATEADD(hour, 10, DATEADD(day, -14, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao, observacoes)
VALUES (@pac1Id, @anaId,
        DATEADD(hour, 10, DATEADD(day, -14, @hoje)),
        60, 150.00, 'realizada',
        'Sessão de acompanhamento — técnicas de respiração e reestruturação cognitiva.');

IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac2Id AND psicologo_id = @carlosId AND data_sessao = DATEADD(hour, 14, DATEADD(day, -7, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao, observacoes)
VALUES (@pac2Id, @carlosId,
        DATEADD(hour, 14, DATEADD(day, -7, @hoje)),
        60, 180.00, 'realizada',
        'Primeira sessão de terapia de casal — mapeamento de conflitos.');

-- 1 sessão CANCELADA
IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac1Id AND psicologo_id = @juliaId AND data_sessao = DATEADD(hour, 9, DATEADD(day, -3, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao, observacoes)
VALUES (@pac1Id, @juliaId,
        DATEADD(hour, 9, DATEADD(day, -3, @hoje)),
        60, 200.00, 'cancelada',
        'Cancelada pelo paciente — reagendamento pendente.');

-- 2 sessões AGENDADAS com link_reuniao (próximas, com Google Meet placeholder)
IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac1Id AND psicologo_id = @anaId AND data_sessao = DATEADD(hour, 10, DATEADD(day, 1, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao,
                     link_reuniao, google_event_id, observacoes)
VALUES (@pac1Id, @anaId,
        DATEADD(hour, 10, DATEADD(day, 1, @hoje)),
        60, 150.00, 'agendada',
        'https://meet.google.com/demo-cedro-001',
        'demo_event_001',
        'Sessão de acompanhamento semanal.');

IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac2Id AND psicologo_id = @carlosId AND data_sessao = DATEADD(hour, 14, DATEADD(day, 2, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao,
                     link_reuniao, google_event_id, observacoes)
VALUES (@pac2Id, @carlosId,
        DATEADD(hour, 14, DATEADD(day, 2, @hoje)),
        60, 180.00, 'agendada',
        'https://meet.google.com/demo-cedro-002',
        'demo_event_002',
        'Segunda sessão de terapia de casal.');

-- 3 sessões AGENDADAS espalhadas na semana atual (para popular FullCalendar)
IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac1Id AND psicologo_id = @juliaId AND data_sessao = DATEADD(hour, 9, DATEADD(day, 3, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao, observacoes)
VALUES (@pac1Id, @juliaId,
        DATEADD(hour, 9, DATEADD(day, 3, @hoje)),
        60, 200.00, 'agendada',
        'Sessão de EMDR — fase de processamento.');

IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac2Id AND psicologo_id = @anaId AND data_sessao = DATEADD(hour, 11, DATEADD(day, 4, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao, observacoes)
VALUES (@pac2Id, @anaId,
        DATEADD(hour, 11, DATEADD(day, 4, @hoje)),
        60, 150.00, 'agendada',
        'Avaliação inicial de ansiedade.');

IF NOT EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = @pac1Id AND psicologo_id = @carlosId AND data_sessao = DATEADD(hour, 16, DATEADD(day, 5, @hoje)))
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, duracao, valor, status_sessao, observacoes)
VALUES (@pac1Id, @carlosId,
        DATEADD(hour, 16, DATEADD(day, 5, @hoje)),
        60, 180.00, 'agendada',
        'Sessão de orientação familiar.');

-- ── 4. MENSAGENS DE CHAT DEMO ────────────────────────────────
IF NOT EXISTS (SELECT 1 FROM mensagens WHERE remetente_id = @pac1Id AND destinatario_id = @anaId)
BEGIN
    INSERT INTO mensagens (remetente_id, destinatario_id, mensagem, lida, data_criacao)
    VALUES
    (@pac1Id, @anaId,
     'Olá Dra. Ana! Estou ansioso para nossa próxima sessão. Tenho praticado os exercícios de respiração.',
     1, DATEADD(hour, -48, GETDATE())),

    (@anaId, @pac1Id,
     'Que ótimo! Fico feliz em saber. Continue praticando, isso faz toda a diferença. Até amanhã!',
     1, DATEADD(hour, -47, GETDATE())),

    (@pac1Id, @anaId,
     'Dra. Ana, tive uma semana difícil no trabalho. Posso trazer isso na sessão?',
     1, DATEADD(hour, -24, GETDATE())),

    (@anaId, @pac1Id,
     'Claro! Esse é exatamente o espaço para isso. Anote os pontos principais para não esquecer.',
     0, DATEADD(hour, -23, GETDATE())),

    (@pac2Id, @carlosId,
     'Dr. Carlos, confirmando nossa sessão de amanhã às 14h.',
     1, DATEADD(hour, -12, GETDATE())),

    (@carlosId, @pac2Id,
     'Confirmado! Até amanhã. Lembre de trazer as anotações que combinamos.',
     0, DATEADD(hour, -11, GETDATE()));
END

-- ── FIM ──────────────────────────────────────────────────────
SELECT 'Seed de demonstração aplicado com sucesso.' AS resultado;
