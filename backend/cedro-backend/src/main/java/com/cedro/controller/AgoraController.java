package com.cedro.controller;

import com.cedro.model.dto.AgoraTokenRequest;
import com.cedro.security.JwtUtil;
import com.cedro.service.AgoraService;
import com.cedro.service.AssinaturaService;
import com.cedro.service.ChamadaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/agora")
public class AgoraController {

    private static final int LIMITE_CHAMADAS_GRATUITAS = 10;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AgoraService agoraService;

    @Autowired
    private AssinaturaService assinaturaService;

    @Autowired
    private ChamadaService chamadaService;

    private Integer getUserIdFromToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    @PostMapping("/token")
    public ResponseEntity<?> gerarToken(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AgoraTokenRequest request) {
        Integer usuarioId = getUserIdFromToken(authHeader);

        boolean premium = assinaturaService.isPremium(usuarioId);
        int chamadasRealizadas = chamadaService.contarChamadasMes(usuarioId);
        if (!premium && chamadasRealizadas >= LIMITE_CHAMADAS_GRATUITAS) {
            return ResponseEntity.status(403).body(Map.of("error", "Limite de chamadas atingido"));
        }

        return ResponseEntity.ok(agoraService.gerarToken(usuarioId, request.getChannelName()));
    }
}
