package com.cedro.controller;

import com.cedro.repository.SessaoRepository;
import com.cedro.security.JwtUtil;
import com.cedro.service.AssinaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@RestController
@RequestMapping("/api/assinatura")
public class AssinaturaController {

    @Autowired
    private AssinaturaService assinaturaService;

    @Autowired
    private SessaoRepository sessaoRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${revenuecat.webhook.secret:}")
    private String webhookSecret;

    private static final ZoneId ZONA_SAO_PAULO = ZoneId.of("America/Sao_Paulo");
    private static final int LIMITE_SESSOES_GRATIS_MES = 4;

    @PostMapping("/webhook")
    public ResponseEntity<?> webhookRevenueCat(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody Map<String, Object> payload) {
        if (!isAuthorized(authorization)) {
            return ResponseEntity.status(401).body(Map.of("error", "Webhook nao autorizado"));
        }

        Map<String, Object> event = asMap(payload.get("event"));
        String type = asString(event.get("type"));
        String appUserId = asString(event.get("app_user_id"));

        if (type == null || appUserId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Payload RevenueCat invalido"));
        }

        Integer usuarioId = Integer.valueOf(appUserId);
        Long expirationAtMs = asLong(event.get("expiration_at_ms"));
        String productId = asString(event.get("product_id"));
        String transactionId = asString(event.get("transaction_id"));

        switch (type) {
            case "INITIAL_PURCHASE":
            case "RENEWAL":
            case "UNCANCELLATION":
                assinaturaService.ativarAssinatura(
                        usuarioId, appUserId, productId, transactionId, expirationAtMs);
                break;
            case "CANCELLATION":
                if (expirationAtMs != null && expirationAtMs > System.currentTimeMillis()) {
                    assinaturaService.ativarAssinatura(
                            usuarioId, appUserId, productId, transactionId, expirationAtMs);
                } else {
                    assinaturaService.cancelarAssinatura(usuarioId);
                }
                break;
            case "EXPIRATION":
                assinaturaService.expirarAssinatura(usuarioId);
                break;
            default:
                break;
        }

        return ResponseEntity.ok(Map.of("message", "Webhook processado"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> statusAssinatura(@RequestHeader("Authorization") String authHeader) {
        Integer usuarioId = jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
        boolean isPremium = assinaturaService.isPremium(usuarioId);

        LocalDateTime inicioMes = LocalDate.now(ZONA_SAO_PAULO).withDayOfMonth(1).atStartOfDay();
        LocalDateTime inicioProximoMes = inicioMes.plusMonths(1);
        long sessoesAgendadasNoMes = sessaoRepository.countByPacienteIdAndDataCriacaoBetweenAndStatusSessaoNot(
                usuarioId,
                inicioMes,
                inicioProximoMes,
                "cancelada"
        );

        int limiteMensal = isPremium ? Integer.MAX_VALUE : LIMITE_SESSOES_GRATIS_MES;
        return ResponseEntity.ok(Map.of(
                "isPremium", isPremium,
                // Nome legado do sistema anterior (Agora.io). Hoje representa a contagem de
                // sessões agendadas não-canceladas no mês corrente. Mantido por compatibilidade
                // com o contrato de API já consumido pelo mobile.
                "chamadasRealizadas", sessoesAgendadasNoMes,
                "limiteMensal", limiteMensal
        ));
    }

    private boolean isAuthorized(String authorization) {
        if (webhookSecret == null || webhookSecret.isBlank() || authorization == null) {
            return false;
        }

        return authorization.equals(webhookSecret)
                || authorization.equals("Bearer " + webhookSecret);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        return Map.of();
    }

    private String asString(Object value) {
        return value instanceof String string ? string : null;
    }

    private Long asLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String string && !string.isBlank()) {
            return Long.valueOf(string);
        }
        return null;
    }
}
