package com.cedro.controller;

import com.cedro.service.AssinaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/assinatura")
public class AssinaturaController {

    @Autowired
    private AssinaturaService assinaturaService;

    @Value("${revenuecat.webhook.secret:}")
    private String webhookSecret;

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
