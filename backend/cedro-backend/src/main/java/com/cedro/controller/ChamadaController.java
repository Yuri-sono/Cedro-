package com.cedro.controller;

import com.cedro.security.JwtUtil;
import com.cedro.service.AssinaturaService;
import com.cedro.service.ChamadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chamadas")
public class ChamadaController {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AssinaturaService assinaturaService;
    
    @Autowired
    private ChamadaService chamadaService;
    
    private Integer getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }
    
    @GetMapping("/limite")
    public ResponseEntity<?> verificarLimite(@RequestHeader("Authorization") String authHeader) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        
        boolean isPremium = assinaturaService.isPremium(usuarioId);
        int chamadasRealizadas = chamadaService.contarChamadasMes(usuarioId);
        int limiteMensal = isPremium ? 999999 : 10;
        
        return ResponseEntity.ok(Map.of(
            "isPremium", isPremium,
            "chamadasRealizadas", chamadasRealizadas,
            "limiteMensal", limiteMensal
        ));
    }
    
    @PostMapping("/{channelName}/finalizar")
    public ResponseEntity<?> finalizarChamada(
        @PathVariable String channelName,
        @RequestBody Map<String, Object> body,
        @RequestHeader("Authorization") String authHeader
    ) {
        Integer usuarioId = getUserIdFromToken(authHeader);
        Object duracao = body.get("duracaoSegundos");
        Integer duracaoSegundos = duracao instanceof Number number ? number.intValue() : 0;
        String tipo = String.valueOf(body.getOrDefault("tipo", "video"));
        
        chamadaService.registrarChamada(usuarioId, channelName, tipo, duracaoSegundos);
        
        return ResponseEntity.ok(Map.of("message", "Chamada registrada"));
    }
}
