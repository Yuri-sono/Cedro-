package com.cedro.controller;

import com.cedro.security.JwtUtil;
import com.cedro.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    // TODO (backend — decisão de produto): os lembretes de consulta (60/30/15/10/5
    // minutos antes da sessão) JÁ são enviados pelo @Scheduled verificarLembretes()
    // em NotificacaoService. O endpoint abaixo é opcional, para disparo manual/
    // externo do envio de lembretes (ex.: cron externo):
    //   POST /api/notificacoes/enviar-lembretes
    //   → chamaria notificacaoService.verificarLembretes() sob demanda.
    // Implementar somente se o produto confirmar a necessidade de disparo manual.

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private NotificacaoService notificacaoService;
    
    private Integer getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
    
    @PostMapping("/token")
    public ResponseEntity<?> registrarToken(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Map<String, String> body
    ) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        String token = body.get("token");
        
        notificacaoService.registrarToken(usuarioId, token);
        
        return ResponseEntity.ok(Map.of("message", "Token registrado"));
    }
    
    @PostMapping("/token/remover")
    public ResponseEntity<?> removerToken(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Map<String, String> body
    ) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        String token = body.get("token");
        
        notificacaoService.removerToken(usuarioId, token);
        
        return ResponseEntity.ok(Map.of("message", "Token removido"));
    }
}
