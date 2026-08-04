package com.cedro.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarResetSenha(String destinatario, String token) {
        String baseUrl = frontendUrl.replaceAll("/+$", "");
        String link = baseUrl + "/redefinir-senha?token=" + token;

        if (!mailEnabled) {
            log.warn("[MAIL_ENABLED=false] Link de reset para {}: {}", destinatario, link);
            return;
        }

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromAddress);
        msg.setTo(destinatario);
        msg.setSubject("Cedro Plus — Redefinição de senha");
        msg.setText("Clique no link abaixo para redefinir sua senha (válido por 30 minutos):\n\n" + link
                + "\n\nSe você não solicitou isso, ignore este e-mail.");
        mailSender.send(msg);
    }
}
