package com.cedro.controller;

import com.cedro.model.dto.MensagemRequest;
import com.cedro.model.entity.Mensagem;
import com.cedro.service.MensagemService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class ChatStompController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MensagemService mensagemService;

    public ChatStompController(SimpMessagingTemplate simpMessagingTemplate, MensagemService mensagemService) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.mensagemService = mensagemService;
    }

    @MessageMapping("/chat.send")
    public void sendChat(@Payload MensagemRequest request, Principal principal) {
        if (principal == null) return;
        String remetenteIdStr = principal.getName();
        Integer remetenteId;
        try {
            remetenteId = Integer.parseInt(remetenteIdStr);
        } catch (NumberFormatException ex) {
            return;
        }

        Mensagem saved = mensagemService.enviarMensagem(remetenteId, request);

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "chat:message");
        payload.put("mensagem", saved);

        String destinatario = String.valueOf(request.getDestinatarioId());
        simpMessagingTemplate.convertAndSendToUser(destinatario, "/queue/mensagens", payload);
        simpMessagingTemplate.convertAndSendToUser(remetenteIdStr, "/queue/mensagens", payload);
    }

    @MessageMapping("/presence.ready")
    public void presenceReady(Principal principal) {
        // optional: could log or send ack; left intentionally simple
    }
}
