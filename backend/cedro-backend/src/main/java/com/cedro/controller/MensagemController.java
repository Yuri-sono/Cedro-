package com.cedro.controller;

import com.cedro.model.dto.MensagemRequest;
import com.cedro.model.entity.Mensagem;
import com.cedro.security.JwtUtil;
import com.cedro.service.MensagemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mensagens")
public class MensagemController {

    @Autowired
    private MensagemService mensagemService;

    @Autowired
    private JwtUtil jwtUtil;

    private Integer getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    @PostMapping
    public ResponseEntity<?> enviarMensagem(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody MensagemRequest request) {
        Integer remetenteId = getUserIdFromToken(authHeader);
        Mensagem mensagem = mensagemService.enviarMensagem(remetenteId, request);
        return ResponseEntity.ok(mensagem);
    }

    @GetMapping("/conversa/{userId}")
    public ResponseEntity<?> listarConversa(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer userId) {
        Integer meuId = getUserIdFromToken(authHeader);
        List<Mensagem> mensagens = mensagemService.listarConversa(meuId, userId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<?> listarMensagensNaoLidas(@RequestHeader("Authorization") String authHeader) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        List<Mensagem> mensagens = mensagemService.listarMensagensNaoLidas(usuarioId);
        return ResponseEntity.ok(mensagens);
    }

    @GetMapping("/nao-lidas/count")
    public ResponseEntity<?> contarMensagensNaoLidas(@RequestHeader("Authorization") String authHeader) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        long count = mensagemService.contarMensagensNaoLidas(usuarioId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/lida")
    public ResponseEntity<?> marcarComoLida(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        Mensagem msg = mensagemService.buscarPorId(id);
        if (!msg.getDestinatarioId().equals(usuarioId))
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        mensagemService.marcarComoLida(id);
        return ResponseEntity.ok(Map.of("message", "ok"));
    }

    @PutMapping("/marcar-lidas/{remetenteId}")
    public ResponseEntity<?> marcarTodasComoLidas(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Integer remetenteId) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        mensagemService.marcarTodasComoLidas(usuarioId, remetenteId);
        return ResponseEntity.ok(Map.of("message", "ok"));
    }

    /**
     * Lista conversas agrupadas por usuário
     * GET /api/mensagens/conversas
     */
    @GetMapping("/conversas")
    public ResponseEntity<?> listarConversas(@RequestHeader("Authorization") String authHeader) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(mensagemService.listarConversas(usuarioId));
    }
}
