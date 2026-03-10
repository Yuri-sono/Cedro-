-- ============================================
-- Dados de Exemplo para o Banco Cedro
-- Popula todas as tabelas com dados de teste
-- ============================================

-- IMPORTANTE: As senhas abaixo são apenas exemplos
-- Em produção, use senhas reais hasheadas com bcrypt

-- Inserir Pacientes
INSERT INTO usuarios (nome, email, senha_hash, telefone, data_nascimento, genero, tipo_usuario, ativo)
VALUES 
('João Silva', 'joao@email.com', '$2b$10$exemplo1', '11999999999', '1990-05-15', 'masculino', 'paciente', 1),
('Maria Santos', 'maria@email.com', '$2b$10$exemplo2', '11988888888', '1985-08-20', 'feminino', 'paciente', 1),
('Pedro Costa', 'pedro@email.com', '$2b$10$exemplo3', '11977777777', '1995-03-10', 'masculino', 'paciente', 1);

-- Inserir Psicólogos
INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario, especialidade, preco_sessao, avaliacao, bio, ativo)
VALUES 
('Dra. Ana Silva', 'ana.psicologo@email.com', '$2b$10$exemplo4', '11966666666', 'psicologo', 'Ansiedade e Depressão', 150.00, 4.8, 'Psicóloga com 10 anos de experiência em terapia cognitivo-comportamental.', 1),
('Dr. Carlos Mendes', 'carlos.psicologo@email.com', '$2b$10$exemplo5', '11955555555', 'psicologo', 'Relacionamentos', 180.00, 4.9, 'Especialista em terapia de casais e relacionamentos.', 1),
('Dra. Juliana Lima', 'juliana.psicologo@email.com', '$2b$10$exemplo6', '11944444444', 'psicologo', 'Autoestima', 120.00, 5.0, 'Focada em desenvolvimento pessoal e autoconhecimento.', 1);

-- Inserir Psicólogos Adicionais (dados mock)
INSERT INTO usuarios (nome, email, senha_hash, telefone, tipo_usuario, especialidade, preco_sessao, avaliacao, bio, ativo)
VALUES
('Mariana Oliveira', 'mariana.oliveira@cedro.com', '$2b$10$exemplo8', '11933330001', 'psicologo', 'Ansiedade e Estresse', 140.00, 4.7, 'Psicóloga com foco em terapia breve e técnicas de regulação emocional.', 1),
('Rafael Andrade', 'rafael.andrade@cedro.com', '$2b$10$exemplo9', '11933330002', 'psicologo', 'Casais e Família', 190.00, 4.6, 'Atuação em terapia de casais e mediação familiar.', 1),
('Beatriz Ferreira', 'beatriz.ferreira@cedro.com', '$2b$10$exemplo10', '11933330003', 'psicologo', 'Depressão e Luto', 130.00, 4.8, 'Atendimento empático para processos de luto e depressão.', 1),
('Lucas Pereira', 'lucas.pereira@cedro.com', '$2b$10$exemplo11', '11933330004', 'psicologo', 'Adolescentes e Família', 120.00, 4.5, 'Trabalho com adolescentes, dinâmica familiar e orientação escolar.', 1),
('Carla Nogueira', 'carla.nogueira@cedro.com', '$2b$10$exemplo12', '11933330005', 'psicologo', 'Trauma e EMDR', 200.00, 4.9, 'Especialista em trauma e protocolos de EMDR.', 1),
('Tiago Ramos', 'tiago.ramos@cedro.com', '$2b$10$exemplo13', '11933330006', 'psicologo', 'Mindfulness e Stress', 110.00, 4.4, 'Integra mindfulness e práticas corporais em terapia.', 1),
('Fernanda Gomes', 'fernanda.gomes@cedro.com', '$2b$10$exemplo14', '11933330007', 'psicologo', 'Autoestima e Desenvolvimento Pessoal', 125.00, 4.6, 'Foco em autoconhecimento, autoconfiança e metas de vida.', 1),
('Bruno Almeida', 'bruno.almeida@cedro.com', '$2b$10$exemplo15', '11933330008', 'psicologo', 'Dependências e Comportamento', 160.00, 4.3, 'Atuação com dependências comportamentais e substâncias.', 1),
('Patricia Souza', 'patricia.souza@cedro.com', '$2b$10$exemplo16', '11933330009', 'psicologo', 'Transtornos Alimentares', 170.00, 4.7, 'Especialista em transtornos alimentares e imagem corporal.', 1),
('Roberto Martins', 'roberto.martins@cedro.com', '$2b$10$exemplo17', '11933330010', 'psicologo', 'TOC e Fobias', 155.00, 4.8, 'Tratamento de TOC, fobias e transtornos de ansiedade.', 1),
('Camila Ribeiro', 'camila.ribeiro@cedro.com', '$2b$10$exemplo18', '11933330011', 'psicologo', 'Gestantes e Pós-parto', 145.00, 4.9, 'Apoio psicológico para gestantes e puérperas.', 1),
('Eduardo Santos', 'eduardo.santos@cedro.com', '$2b$10$exemplo19', '11933330012', 'psicologo', 'Carreira e Burnout', 165.00, 4.5, 'Orientação profissional e prevenção de burnout.', 1),
('Marcelo Dias', 'marcelo.dias@cedro.com', '$2b$10$exemplo21', '11933330014', 'psicologo', 'Terceira Idade', 115.00, 4.6, 'Especialista em questões da terceira idade e envelhecimento.', 1),
('Vanessa Lima', 'vanessa.lima@cedro.com', '$2b$10$exemplo22', '11933330015', 'psicologo', 'Sexualidade e Relacionamentos', 175.00, 4.7, 'Terapia sexual e de relacionamentos íntimos.', 1),
('Gustavo Rocha', 'gustavo.rocha@cedro.com', '$2b$10$exemplo23', '11933330016', 'psicologo', 'Neuropsicologia', 195.00, 4.8, 'Avaliação neuropsicológica e reabilitação cognitiva.', 1),
('Amanda Silva', 'amanda.silva@cedro.com', '$2b$10$exemplo24', '11933330017', 'psicologo', 'Crianças e Ludoterapia', 130.00, 4.9, 'Atendimento infantil com técnicas lúdicas.', 1),
('Felipe Azevedo', 'felipe.azevedo@cedro.com', '$2b$10$exemplo25', '11933330018', 'psicologo', 'Vícios e Compulsões', 180.00, 4.4, 'Tratamento de vícios, compulsões e comportamentos aditivos.', 1),
('Larissa Moreira', 'larissa.moreira@cedro.com', '$2b$10$exemplo26', '11933330019', 'psicologo', 'Terapia Breve', 125.00, 4.6, 'Abordagem focada em soluções e resultados rápidos.', 1),
('Daniel Barbosa', 'daniel.barbosa@cedro.com', '$2b$10$exemplo27', '11933330020', 'psicologo', 'Psicologia Positiva', 140.00, 4.7, 'Foco em forças pessoais e bem-estar.', 1);

-- Inserir Admin
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, ativo)
VALUES 
('Administrador', 'admin@cedro.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjefYRIs1WlsqRQqTvNv3euKB4s1aGy', 'admin', 1);

-- Inserir Sessões
INSERT INTO sessoes (paciente_id, psicologo_id, data_sessao, valor, status_sessao)
VALUES 
(1, 4, '2025-02-01 10:00:00', 150.00, 'agendada'),
(1, 4, '2025-01-25 10:00:00', 150.00, 'realizada'),
(2, 5, '2025-02-02 14:00:00', 180.00, 'agendada'),
(3, 6, '2025-02-03 16:00:00', 120.00, 'agendada');

-- Inserir Pagamentos
INSERT INTO pagamentos (sessao_id, valor, status_pagamento, metodo_pagamento, data_pagamento)
VALUES 
(2, 150.00, 'pago', 'pix', '2025-01-25 09:30:00'),
(1, 150.00, 'pendente', 'pix', NULL);

-- Inserir Avaliações
INSERT INTO avaliacoes (sessao_id, paciente_id, psicologo_id, nota, comentario)
VALUES 
(2, 1, 4, 5, 'Excelente profissional! Me ajudou muito.');

-- Inserir E-books
INSERT INTO ebooks (titulo, descricao, categoria, paginas, arquivo_url)
VALUES 
('Guia Completo sobre Ansiedade', 'Entenda os sintomas, causas e estratégias para lidar com a ansiedade.', 'Ansiedade', 45, '/ebooks/ansiedade.pdf'),
('Superando a Depressão', 'Manual prático com técnicas e exercícios.', 'Depressão', 62, '/ebooks/depressao.pdf'),
('Mindfulness para Iniciantes', 'Fundamentos da atenção plena.', 'Mindfulness', 38, '/ebooks/mindfulness.pdf'),
('Gestão do Estresse', 'Técnicas eficazes para gerenciar o estresse.', 'Estresse', 52, '/ebooks/estresse.pdf');

-- Inserir Meditações
INSERT INTO meditacoes (titulo, descricao, duracao, nivel, audio_url)
VALUES 
('Respiração Consciente', 'Meditação focada na respiração.', 10, 'Iniciante', '/audios/respiracao.mp3'),
('Body Scan Relaxante', 'Varredura corporal para relaxamento.', 15, 'Intermediário', '/audios/bodyscan.mp3'),
('Mindfulness para Ansiedade', 'Atenção plena para ansiedade.', 12, 'Iniciante', '/audios/ansiedade.mp3'),
('Meditação para o Sono', 'Preparação para o sono.', 20, 'Todos os níveis', '/audios/sono.mp3');

-- Inserir Webinars
INSERT INTO webinars (titulo, palestrante, data_webinar, duracao, status, vagas)
VALUES 
('Ansiedade: Entendendo e Controlando', 'Dra. Maria Silva', '2025-03-15 19:00:00', 90, 'agendado', 100),
('Depressão: Sinais e Tratamentos', 'Dr. João Santos', '2025-03-22 19:00:00', 90, 'agendado', 100),
('Mindfulness para Iniciantes', 'Psic. Ana Costa', '2025-03-29 19:00:00', 60, 'agendado', 100);

-- Inserir Grupos de Terapia
INSERT INTO grupos_terapia (nome, descricao, psicologo_id, horario, dia_semana, vagas_total, vagas_disponiveis, preco_sessao)
VALUES 
('Ansiedade e Pânico', 'Grupo focado em técnicas para lidar com ansiedade.', 4, '19:00', 'Terça', 8, 3, 80.00),
('Depressão e Autoestima', 'Apoio mútuo para superar a depressão.', 5, '18:00', 'Quinta', 8, 2, 80.00),
('Luto e Perdas', 'Espaço seguro para elaborar perdas.', 6, '10:00', 'Sábado', 8, 4, 80.00),
('Habilidades Sociais', 'Desenvolvimento de competências sociais.', 4, '17:00', 'Segunda', 8, 1, 80.00);

-- Inserir Autoavaliações
INSERT INTO autoavaliacoes (usuario_id, pontuacao, nivel, respostas)
VALUES 
(1, 8, 'Bem-estar Bom', '{"1":1,"2":2,"3":1,"4":2,"5":2}'),
(2, 12, 'Atenção Necessária', '{"1":2,"2":3,"3":2,"4":3,"5":2}');
