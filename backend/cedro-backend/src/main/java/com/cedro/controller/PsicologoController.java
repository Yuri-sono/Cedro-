package com.cedro.controller;

import com.cedro.model.TipoUsuario;
import com.cedro.model.dto.PsicologoResponse;
import com.cedro.model.entity.Sessao;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import com.cedro.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/psicologos")
public class PsicologoController {

    @Autowired private JwtUtil jwtUtil;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private SessaoRepository sessaoRepository;

    @GetMapping
    public ResponseEntity<?> listarPsicologos(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        String areaInteresse = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                Integer requesterId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
                areaInteresse = usuarioRepository.findById(requesterId)
                        .filter(u -> u.getTipoUsuario() == TipoUsuario.paciente)
                        .map(Usuario::getAreaInteresse)
                        .orElse(null);
            } catch (Exception ignored) {
                areaInteresse = null;
            }
        }
        final String interesseDoPaciente = areaInteresse;

        var psicologos = usuarioRepository.findByTipoUsuarioAndAtivo(TipoUsuario.psicologo, true);
        // SEGURANÇA: Retornar apenas dados públicos, não o entity completo
        var dtos = psicologos.stream()
                .filter(p -> combinaComInteresse(interesseDoPaciente, p.getTipoPsicologo()))
                .map(p -> {
            java.util.Map<String, Object> dto = new java.util.LinkedHashMap<>();
            dto.put("id", p.getId());
            dto.put("nome", p.getNome());
            dto.put("especialidade", p.getEspecialidade());
            dto.put("tipoPsicologo", p.getTipoPsicologo());
            dto.put("bio", p.getBio());
            dto.put("precoSessao", p.getPrecoSessao());
            dto.put("avaliacao", p.getAvaliacao());
            dto.put("fotoUrl", p.getFotoUrl());
            dto.put("diasAtendimento", PsicologoResponse.parseDias(p.getDiasAtendimento()));
            dto.put("horariosAtendimento", PsicologoResponse.parseHorarios(p.getHorariosAtendimento()));
            // Não expor: email, telefone, senhaHash, dataCriacao, ativo
            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private boolean combinaComInteresse(String areaInteresse, String tipoPsicologo) {
        if (areaInteresse == null || areaInteresse.isBlank()) {
            return true;
        }
        if (tipoPsicologo == null || tipoPsicologo.isBlank()) {
            return true;
        }

        Set<String> interesse = normalizarTags(areaInteresse);
        Set<String> tipos = normalizarTags(tipoPsicologo);

        if (interesse.isEmpty() || tipos.isEmpty()) {
            return true;
        }

        for (String tag : interesse) {
            if (tipos.contains(tag)) {
                return true;
            }
        }

        return false;
    }

    private Set<String> normalizarTags(String texto) {
        return Stream.of(texto.split("[,;/|]"))
                .map(this::normalizarTexto)
                .filter(tag -> !tag.isBlank())
                .collect(java.util.stream.Collectors.toSet());
    }

    private String normalizarTexto(String texto) {
        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return semAcento.toLowerCase().trim();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        Usuario p = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Não encontrado"));
        if (p.getTipoUsuario() != TipoUsuario.psicologo)
            return ResponseEntity.badRequest().body(Map.of("error", "Não é psicólogo"));
        return ResponseEntity.ok(PsicologoResponse.fromUsuario(p));
    }

    /**
     * Lista pacientes DISTINTOS que já têm pelo menos uma sessão com o psicólogo.
     * Autorização: apenas o próprio psicólogo (id do token) ou admin.
     */
    @GetMapping("/{id}/pacientes")
    public ResponseEntity<?> listarPacientes(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Integer requesterId = jwtUtil.extractUserId(token);
        String tipo = jwtUtil.extractTipoUsuario(token);
        if (!"admin".equals(tipo) && !requesterId.equals(id)) {
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }

        List<Integer> pacienteIds = sessaoRepository.findDistinctPacienteIdsByPsicologo(id);
        List<Map<String, Object>> pacientes = pacienteIds.stream()
                .flatMap(pacienteId -> usuarioRepository.findById(pacienteId).stream())
                .sorted(Comparator.comparing(Usuario::getNome))
                .map(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", p.getId());
                    item.put("nome", p.getNome());
                    item.put("email", p.getEmail());
                    return item;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(pacientes);
    }

    /**
     * Verifica se um CRP é válido e se já existe no banco de dados.
     * Formato esperado: XX/XXXXXX (2 dígitos / 5 ou 6 dígitos)
     */
    @GetMapping("/verificar-crp")
    public ResponseEntity<?> verificarCrp(@RequestParam String crp) {
        // Validar formato do CRP
        if (!crp.matches("\\d{2}/\\d{5,6}")) {
            return ResponseEntity.badRequest().body(Map.of(
                "valido", false,
                "mensagem", "Formato de CRP inválido. Use: XX/XXXXXX"
            ));
        }
        
        // Verificar se o CRP já está cadastrado por outro psicólogo
        if (usuarioRepository.existsByCrp(crp)) {
            return ResponseEntity.status(409).body(Map.of(
                "valido", false,
                "mensagem", "Este CRP já está cadastrado na plataforma."
            ));
        }
        
        // CRP com formato válido e não duplicado
        return ResponseEntity.ok(Map.of(
            "valido", true,
            "mensagem", "CRP disponível para cadastro"
        ));
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody Usuario psicologo,
            @RequestHeader("Authorization") String authHeader) {
        if (!"admin".equals(jwtUtil.extractTipoUsuario(authHeader.replace("Bearer ", ""))))
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        if (usuarioRepository.existsByEmail(psicologo.getEmail()))
            return ResponseEntity.badRequest().body(Map.of("error", "Email já existe"));
        psicologo.setTipoUsuario(TipoUsuario.psicologo);
        psicologo.setAtivo(true);
        return ResponseEntity.status(201).body(usuarioRepository.save(psicologo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Integer id,
            @RequestBody Usuario dados,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Integer requesterId = jwtUtil.extractUserId(token);
        String tipo = jwtUtil.extractTipoUsuario(token);
        if (!"admin".equals(tipo) && !requesterId.equals(id))
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        Usuario p = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Não encontrado"));
        if (p.getTipoUsuario() != TipoUsuario.psicologo)
            return ResponseEntity.badRequest().body(Map.of("error", "Não é psicólogo"));
        if (dados.getNome() != null) p.setNome(dados.getNome());
        if (dados.getEmail() != null) p.setEmail(dados.getEmail());
        if (dados.getTelefone() != null) p.setTelefone(dados.getTelefone());
        if (dados.getEspecialidade() != null) p.setEspecialidade(dados.getEspecialidade());
        if (dados.getTipoPsicologo() != null) p.setTipoPsicologo(dados.getTipoPsicologo());
        if (dados.getPrecoSessao() != null) p.setPrecoSessao(dados.getPrecoSessao());
        if (dados.getBio() != null) p.setBio(dados.getBio());
        if (dados.getFotoUrl() != null) p.setFotoUrl(dados.getFotoUrl());
        return ResponseEntity.ok(usuarioRepository.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        if (!"admin".equals(jwtUtil.extractTipoUsuario(authHeader.replace("Bearer ", ""))))
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        Usuario p = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Não encontrado"));
        if (p.getTipoUsuario() != TipoUsuario.psicologo)
            return ResponseEntity.badRequest().body(Map.of("error", "Não é psicólogo"));
        p.setAtivo(false);
        usuarioRepository.save(p);
        return ResponseEntity.ok(Map.of("message", "Desativado"));
    }

    @GetMapping("/financeiro")
    public ResponseEntity<?> getFinanceiro(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "mes") String periodo) {
        Integer psicologoId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));

        LocalDateTime inicio;
        LocalDateTime fim = LocalDateTime.now().plusDays(1).toLocalDate().atStartOfDay();
        LocalDateTime agora = LocalDateTime.now();

        switch (periodo) {
            case "trimestre" -> inicio = agora.minusMonths(3).toLocalDate().atStartOfDay();
            case "ano"       -> inicio = LocalDate.now().withDayOfYear(1).atStartOfDay();
            default          -> inicio = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        }

        List<Sessao> sessoes = sessaoRepository.findByPsicologoIdAndDataSessaoBetween(psicologoId, inicio, fim);

        java.math.BigDecimal faturamento = sessoes.stream()
                .filter(s -> "realizada".equals(s.getStatusSessao()))
                .map(Sessao::getValor)
                .filter(v -> v != null)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        long consultasRealizadas = sessoes.stream()
                .filter(s -> "realizada".equals(s.getStatusSessao())).count();

        java.math.BigDecimal ticketMedio = consultasRealizadas > 0
                ? faturamento.divide(java.math.BigDecimal.valueOf(consultasRealizadas), 2, java.math.RoundingMode.HALF_UP)
                : java.math.BigDecimal.ZERO;

        List<Map<String, Object>> transacoes = sessoes.stream()
                .filter(s -> !"cancelada".equals(s.getStatusSessao()))
                .sorted((a, b) -> b.getDataSessao().compareTo(a.getDataSessao()))
                .limit(20)
                .map(s -> {
                    Map<String, Object> t = new HashMap<>();
                    t.put("id", s.getId());
                    t.put("data", s.getDataSessao().toLocalDate().toString());
                    t.put("valor", s.getValor());
                    t.put("status", "realizada".equals(s.getStatusSessao()) ? "Pago" : "Pendente");
                    usuarioRepository.findById(s.getPacienteId())
                            .ifPresent(p -> t.put("paciente", p.getNome()));
                    return t;
                }).collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("faturamentoMes", faturamento);
        result.put("consultasRealizadas", consultasRealizadas);
        result.put("ticketMedio", ticketMedio);
        result.put("transacoes", transacoes);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<?> getEstatisticas(@RequestHeader("Authorization") String authHeader) {
        Integer psicologoId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        LocalDateTime hoje = LocalDate.now().atStartOfDay();
        LocalDateTime fimHoje = hoje.plusDays(1);
        LocalDateTime inicioSemana = hoje.minusDays(hoje.getDayOfWeek().getValue() - 1);
        LocalDateTime inicioMes = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime fimMes = inicioMes.plusMonths(1);

        long consultasHoje = sessaoRepository.findByPsicologoIdAndDataSessaoBetween(psicologoId, hoje, fimHoje).size();
        long consultasSemana = sessaoRepository.findByPsicologoIdAndDataSessaoBetween(psicologoId, inicioSemana, fimHoje).size();
        long pacientesAtivos = sessaoRepository.countPacientesAtivosByPsicologoId(psicologoId);
        java.math.BigDecimal faturamentoMes = sessaoRepository.sumValorByPsicologoIdAndPeriodo(psicologoId, inicioMes, fimMes);

        Map<String, Object> stats = new HashMap<>();
        stats.put("consultasHoje", consultasHoje);
        stats.put("consultasSemana", consultasSemana);
        stats.put("pacientesAtivos", pacientesAtivos);
        stats.put("faturamentoMes", faturamentoMes != null ? faturamentoMes : java.math.BigDecimal.ZERO);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/consultas/proximas")
    public ResponseEntity<?> getProximasConsultas(@RequestHeader("Authorization") String authHeader) {
        Integer psicologoId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        List<Sessao> proximas = sessaoRepository
                .findByPsicologoIdAndDataSessaoAfterOrderByDataSessaoAsc(psicologoId, LocalDateTime.now());
        List<Map<String, Object>> resultado = proximas.stream().limit(10).map(s -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", s.getId());
            item.put("pacienteId", s.getPacienteId());
            item.put("data", s.getDataSessao());
            item.put("horario", s.getDataSessao().toLocalTime().toString().substring(0, 5));
            item.put("status", s.getStatusSessao());
            item.put("tipo", "Terapia Individual");
            usuarioRepository.findById(s.getPacienteId())
                    .ifPresent(p -> item.put("pacienteNome", p.getNome()));
            return item;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(resultado);
    }

    /**
     * Retorna as últimas 5 atividades do psicólogo logado, derivadas da tabela
     * de sessões (sem criar tabela de log):
     * a) Sessões "realizada" → tipo "consulta_finalizada", data = data_sessao;
     * b) Sessões "agendada" → tipo "novo_agendamento", data = data_criacao.
     * Combina os dois tipos, ordena pela data (mais recente primeiro) e limita a 5.
     */
    @GetMapping("/atividades-recentes")
    public ResponseEntity<?> getAtividadesRecentes(@RequestHeader("Authorization") String authHeader) {
        Integer psicologoId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));

        List<Sessao> realizadas = sessaoRepository
                .findByPsicologoIdAndStatusSessaoOrderByDataSessaoDesc(psicologoId, "realizada");
        List<Sessao> agendadas = sessaoRepository
                .findByPsicologoIdAndStatusSessaoOrderByDataCriacaoDesc(psicologoId, "agendada");

        List<Map<String, Object>> atividades = new ArrayList<>();

        realizadas.stream().limit(20).forEach(s ->
                usuarioRepository.findById(s.getPacienteId()).ifPresent(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("tipo", "consulta_finalizada");
                    item.put("pacienteNome", p.getNome());
                    item.put("data", s.getDataSessao());
                    item.put("sessaoId", s.getId());
                    atividades.add(item);
                }));

        agendadas.stream().limit(20).forEach(s ->
                usuarioRepository.findById(s.getPacienteId()).ifPresent(p -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("tipo", "novo_agendamento");
                    item.put("pacienteNome", p.getNome());
                    item.put("data", s.getDataCriacao() != null ? s.getDataCriacao() : s.getDataSessao());
                    item.put("dataSessao", s.getDataSessao());
                    item.put("sessaoId", s.getId());
                    atividades.add(item);
                }));

        List<Map<String, Object>> resultado = atividades.stream()
                .sorted(Comparator.comparing((Map<String, Object> m) -> (LocalDateTime) m.get("data"),
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultado);
    }
}
