package com.cedro.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/contato")
public class ContatoController {

    private static final Logger log = LoggerFactory.getLogger(ContatoController.class);

    private static final String EMAIL_DESTINO = "cedro039@gmail.com";

    private final JavaMailSender mailSender;

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    public ContatoController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping
    public ResponseEntity<?> enviarContato(@RequestBody Map<String, String> body) {
        String nome = body.getOrDefault("nome", "");
        String email = body.getOrDefault("email", "");
        String telefone = body.getOrDefault("telefone", "");
        String assunto = body.getOrDefault("assunto", "Sem assunto");
        String mensagem = body.getOrDefault("mensagem", "");

        if (nome.isBlank() || email.isBlank() || mensagem.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nome, email e mensagem sao obrigatorios"));
        }

        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromAddress);
            msg.setTo(EMAIL_DESTINO);
            msg.setReplyTo(email);
            msg.setSubject("Contato Cedro: " + assunto);
            msg.setText(
                    "Nome: " + nome + "\n" +
                    "Email: " + email + "\n" +
                    "Telefone: " + telefone + "\n\n" +
                    "Mensagem:\n" + mensagem
            );

            if (!mailEnabled) {
                log.warn("[MAIL_ENABLED=false] Contato de {} <{}> assunto '{}': {}", nome, email, assunto, mensagem);
            } else {
                mailSender.send(msg);
            }

            return ResponseEntity.ok(Map.of("message", "Mensagem enviada com sucesso"));
        } catch (Exception e) {
            log.error("Erro ao enviar email de contato", e);
            return ResponseEntity.status(500).body(Map.of("error", "Erro ao enviar mensagem"));
        }
    }
}