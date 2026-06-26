package com.cedro.controller;

import com.cedro.security.JwtUtil;
import com.cedro.service.AssinaturaService;
import com.cedro.service.ChamadaService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
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

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${turn.urls:}")
    private String turnUrls;

    @Value("${turn.shared.secret:}")
    private String turnSharedSecret;

    @Value("${turn.username:}")
    private String turnUsername;

    @Value("${turn.credential:}")
    private String turnCredential;

    @Value("${turn.metered.domain:}")
    private String meteredDomain;

    @Value("${turn.metered.secret-key:}")
    private String meteredSecretKey;
    
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

    @GetMapping("/ice-servers")
    public ResponseEntity<?> listarIceServers(@RequestHeader("Authorization") String authHeader) throws Exception {
        Integer usuarioId = getUserIdFromToken(authHeader);
        List<Map<String, Object>> iceServers = new ArrayList<>();
        iceServers.add(Map.of("urls", List.of("stun:stun.l.google.com:19302")));

        List<Map<String, Object>> meteredIceServers = carregarMeteredIceServers();
        if (!meteredIceServers.isEmpty()) {
            return ResponseEntity.ok(Map.of("iceServers", meteredIceServers));
        }

        List<String> urls = Arrays.stream(turnUrls.split(","))
            .map(String::trim)
            .filter(url -> !url.isBlank())
            .toList();

        if (!urls.isEmpty() && !turnSharedSecret.isBlank()) {
            long expiresAt = Instant.now().getEpochSecond() + 3600;
            String username = expiresAt + ":" + usuarioId;
            String credential = hmacSha1Base64(turnSharedSecret, username);
            iceServers.add(Map.of(
                "urls", urls,
                "username", username,
                "credential", credential
            ));
        } else if (!urls.isEmpty() && !turnUsername.isBlank() && !turnCredential.isBlank()) {
            iceServers.add(Map.of(
                "urls", urls,
                "username", turnUsername,
                "credential", turnCredential
            ));
        }

        return ResponseEntity.ok(Map.of("iceServers", iceServers));
    }

    private List<Map<String, Object>> carregarMeteredIceServers() {
        if (meteredDomain.isBlank() || meteredSecretKey.isBlank()) {
            return List.of();
        }

        String domain = meteredDomain.replace("https://", "").replace("http://", "").replaceAll("/+$", "");
        String encodedSecret = URLEncoder.encode(meteredSecretKey, StandardCharsets.UTF_8);
        List<String> queryNames = List.of("apiKey", "secretKey");

        for (String queryName : queryNames) {
            try {
                URI uri = URI.create("https://" + domain + "/api/v1/turn/credentials?" + queryName + "=" + encodedSecret);
                HttpRequest request = HttpRequest.newBuilder(uri).GET().build();
                HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() < 200 || response.statusCode() >= 300) {
                    continue;
                }

                JsonNode root = objectMapper.readTree(response.body());
                JsonNode iceServersNode = root.isArray() ? root : root.path("iceServers");
                if (!iceServersNode.isArray() || iceServersNode.isEmpty()) {
                    continue;
                }

                List<Map<String, Object>> iceServers = new ArrayList<>();
                for (JsonNode item : iceServersNode) {
                    iceServers.add(objectMapper.convertValue(item, Map.class));
                }
                return iceServers;
            } catch (Exception ignored) {
                // Mantem fallback para STUN/coturn/static se Metered estiver indisponivel.
            }
        }

        return List.of();
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

    private String hmacSha1Base64(String secret, String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA1"));
        return Base64.getEncoder().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }
}
