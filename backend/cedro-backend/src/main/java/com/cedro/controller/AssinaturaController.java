package com.cedro.controller;

import com.cedro.service.AssinaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/assinatura")
public class AssinaturaController {
    
    @Autowired
    private AssinaturaService assinaturaService;
    
    @PostMapping("/webhook")
    public ResponseEntity<?> webhookRevenueCat(@RequestBody Map<String, Object> payload) {
        try {
            Map<String, Object> event = (Map<String, Object>) payload.get("event");
            String type = (String) event.get("type");
            
            Map<String, Object> subscriber = (Map<String, Object>) payload.get("subscriber");
            String appUserId = (String) subscriber.get("app_user_id");
            
            Integer usuarioId = Integer.parseInt(appUserId);
            
            switch (type) {
                case "INITIAL_PURCHASE":
                case "RENEWAL":
                    assinaturaService.ativarAssinatura(usuarioId);
                    break;
                    
                case "CANCELLATION":
                case "EXPIRATION":
                    assinaturaService.cancelarAssinatura(usuarioId);
                    break;
            }
            
            return ResponseEntity.ok(Map.of("message", "Webhook processado"));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
