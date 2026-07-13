package com.cedro.controller;

import com.cedro.model.dto.SessaoRequest;
import com.cedro.model.entity.Sessao;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.UsuarioRepository;
import com.cedro.security.JwtUtil;
import com.cedro.service.SessaoService;
import com.cedro.service.GoogleMeetService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.LocalDate;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sessoes")
public class SessaoController {

    @Autowired
    private SessaoService sessaoService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GoogleMeetService googleMeetService;

    @Value("${google.meet.release.minutes.before:15}")
    private Integer meetReleaseMinutesBefore;

    private static final ZoneId ZONA_SAO_PAULO = ZoneId.of("America/Sao_Paulo");

    private Integer getUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
    }

    private boolean isAdmin(String authHeader) {
        try {
            return "admin".equals(jwtUtil.extractTipoUsuario(authHeader.replace("Bearer ", "")));
        } catch (Exception e) { return false; }
    }

    private Map<String, Object> mapearSessaoComNomes(Sessao sessao) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", sessao.getId());
        item.put("pacienteId", sessao.getPacienteId());
        item.put("psicologoId", sessao.getPsicologoId());
        item.put("dataSessao", sessao.getDataSessao());
        item.put("duracao", sessao.getDuracao());
        item.put("valor", sessao.getValor());
        item.put("statusSessao", sessao.getStatusSessao());
        item.put("observacoes", sessao.getObservacoes());
        item.put("dataCriacao", sessao.getDataCriacao());
        item.put("linkReuniao", sessao.getLinkReuniao());
        item.put("googleEventId", sessao.getGoogleEventId());
        usuarioRepository.findById(sessao.getPacienteId()).ifPresentOrElse(
                usuario -> item.put("pacienteNome", usuario.getNome()),
                () -> item.put("pacienteNome", "Paciente #" + sessao.getPacienteId())
        );
        usuarioRepository.findById(sessao.getPsicologoId()).ifPresentOrElse(
                usuario -> item.put("psicologoNome", usuario.getNome()),
                () -> item.put("psicologoNome", "Psicólogo #" + sessao.getPsicologoId())
        );
        return item;
    }

    @GetMapping
    public ResponseEntity<?> listarTodas(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return ResponseEntity.ok(sessaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        Sessao sessao = sessaoService.buscarPorId(id);
        if (!isAdmin(authHeader)
                && !sessao.getPacienteId().equals(requesterId)
                && !sessao.getPsicologoId().equals(requesterId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }
        return ResponseEntity.ok(sessao);
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<Sessao>> listarMinhas(@RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        return ResponseEntity.ok(sessaoService.listarPorPaciente(userId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Sessao>> listarPorPaciente(
            @PathVariable Integer pacienteId,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        if (!isAdmin(authHeader) && !requesterId.equals(pacienteId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(sessaoService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/psicologo/{psicologoId}")
    public ResponseEntity<?> listarPorPsicologo(
            @PathVariable Integer psicologoId,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        if (!isAdmin(authHeader) && !requesterId.equals(psicologoId)) {
            return ResponseEntity.status(403).build();
        }
        List<Map<String, Object>> resultado = sessaoService.listarPorPsicologo(psicologoId)
                .stream()
                .map(this::mapearSessaoComNomes)
                .toList();
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/disponibilidade/{psicologoId}")
    public ResponseEntity<?> consultarDisponibilidade(
            @PathVariable Integer psicologoId,
            @RequestParam("data") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return ResponseEntity.ok(sessaoService.consultarDisponibilidade(psicologoId, data));
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody SessaoRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        request.setPacienteId(userId);
        Sessao sessao = sessaoService.criar(request);
        return ResponseEntity.status(201).body(sessao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Integer id,
            @RequestBody SessaoRequest request,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return ResponseEntity.ok(sessaoService.atualizar(id, request));
    }

    @PostMapping("/{id}/confirmar-pagamento")
    public ResponseEntity<?> confirmarPagamento(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        try {
            Sessao sessaoAtualizada = sessaoService.confirmarPagamento(id, requesterId);
            return ResponseEntity.ok(Map.of("message", "Sessão confirmada com sucesso", "sessao", sessaoAtualizada));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/link-reuniao")
    public ResponseEntity<?> obterLinkReuniao(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        Sessao sessao = sessaoService.buscarPorId(id);
        if (!isAdmin(authHeader)
                && !sessao.getPacienteId().equals(requesterId)
                && !sessao.getPsicologoId().equals(requesterId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }

        LocalDateTime janelaLiberacao = sessao.getDataSessao().minusMinutes(meetReleaseMinutesBefore);
        LocalDateTime now = LocalDateTime.now(ZONA_SAO_PAULO);

        if (now.isBefore(janelaLiberacao)) {
            return ResponseEntity.ok(Map.of(
                    "liberado", false,
                    "disponivelEm", janelaLiberacao.toString()
            ));
        }

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("liberado", true);
        resposta.put("link", sessao.getLinkReuniao());
        if (sessao.getLinkReuniao() == null) {
            resposta.put("erro", "Link ainda não gerado, contate o suporte");
        }
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/{id}/gerar-reuniao")
    public ResponseEntity<?> gerarReuniaoManual(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) {
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }

        Sessao sessao = sessaoService.buscarPorId(id);
        Usuario paciente = usuarioRepository.findById(sessao.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        Usuario psicologo = usuarioRepository.findById(sessao.getPsicologoId())
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        GoogleMeetService.GoogleMeetResultado resultado = googleMeetService.criarReuniao(
                sessao,
                paciente.getNome(),
                psicologo.getNome()
        );

        sessaoService.salvarReuniaoGerada(sessao, resultado.link(), resultado.eventId());

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("message", "Tentativa de geração executada");
        resposta.put("link", resultado.link());
        resposta.put("eventId", resultado.eventId());
        return ResponseEntity.ok(resposta);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        Sessao sessao = sessaoService.buscarPorId(id);
        if (!isAdmin(authHeader) && !sessao.getPacienteId().equals(userId)) { //TODO: adicionar verificação se o psicólogo pode deletar
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }
        sessaoService.deletar(id);
        return ResponseEntity.ok(Map.of("message", "Deletada"));
    }
}
