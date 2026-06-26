package com.cedro.websocket;

import com.cedro.model.dto.MensagemRequest;
import com.cedro.model.entity.Mensagem;
import com.cedro.security.JwtUtil;
import com.cedro.service.MensagemService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class RealtimeWebSocketHandler extends TextWebSocketHandler {

    private final JwtUtil jwtUtil;
    private final MensagemService mensagemService;
    private final ObjectMapper objectMapper;
    private final Map<Integer, Set<WebSocketSession>> sessionsByUser = new ConcurrentHashMap<>();

    public RealtimeWebSocketHandler(JwtUtil jwtUtil, MensagemService mensagemService, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.mensagemService = mensagemService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session.getUri());
        if (token == null || jwtUtil.isTokenExpired(token)) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Token inválido"));
            return;
        }

        Integer userId = jwtUtil.extractUserId(token);
        session.getAttributes().put("userId", userId);
        sessionsByUser.computeIfAbsent(userId, ignored -> new CopyOnWriteArraySet<>()).add(session);
        send(session, Map.of("type", "presence:ready", "userId", userId));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Integer remetenteId = (Integer) session.getAttributes().get("userId");
        if (remetenteId == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Usuário não autenticado"));
            return;
        }

        JsonNode payload = objectMapper.readTree(message.getPayload());
        String type = payload.path("type").asText();

        if ("chat:send".equals(type)) {
            handleChatMessage(session, remetenteId, payload);
            return;
        }

        if (type.startsWith("call:")) {
            forwardCallSignal(remetenteId, payload);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Integer userId = (Integer) session.getAttributes().get("userId");
        if (userId == null) return;

        Set<WebSocketSession> userSessions = sessionsByUser.get(userId);
        if (userSessions != null) {
            userSessions.remove(session);
            if (userSessions.isEmpty()) {
                sessionsByUser.remove(userId);
            }
        }
    }

    private void handleChatMessage(WebSocketSession session, Integer remetenteId, JsonNode payload) throws IOException {
        Integer destinatarioId = payload.path("destinatarioId").asInt();
        String texto = payload.path("mensagem").asText("").trim();
        String clientId = payload.path("clientId").asText("");

        if (destinatarioId <= 0 || texto.isBlank()) {
            send(session, Map.of("type", "error", "message", "Mensagem inválida"));
            return;
        }

        MensagemRequest request = new MensagemRequest();
        request.setDestinatarioId(destinatarioId);
        request.setMensagem(texto);
        Mensagem saved = mensagemService.enviarMensagem(remetenteId, request);

        Map<String, Object> response = Map.of(
            "type", "chat:message",
            "clientId", clientId,
            "mensagem", saved
        );

        sendToUser(remetenteId, response);
        sendToUser(destinatarioId, response);
    }

    private void forwardCallSignal(Integer remetenteId, JsonNode payload) throws IOException {
        Integer destinatarioId = payload.path("destinatarioId").asInt();
        if (destinatarioId <= 0) return;

        Map<String, Object> signal = objectMapper.convertValue(payload, Map.class);
        signal.put("remetenteId", remetenteId);
        sendToUser(destinatarioId, signal);
    }

    private void sendToUser(Integer userId, Object payload) throws IOException {
        Set<WebSocketSession> sessions = sessionsByUser.get(userId);
        if (sessions == null) return;

        for (WebSocketSession session : sessions) {
            send(session, payload);
        }
    }

    private void send(WebSocketSession session, Object payload) throws IOException {
        if (session.isOpen()) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
        }
    }

    private String extractToken(URI uri) {
        if (uri == null) return null;
        return UriComponentsBuilder.fromUri(uri).build().getQueryParams().getFirst("token");
    }
}
