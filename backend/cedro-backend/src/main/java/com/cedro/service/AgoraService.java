package com.cedro.service;

import com.cedro.model.dto.AgoraTokenResponse;
import io.agora.media.RtcTokenBuilder2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AgoraService {

    private static final Pattern CHAT_CHANNEL_PATTERN = Pattern.compile("^chat-(\\d+)-(\\d+)$");

    @Value("${agora.app.id:}")
    private String appId;

    @Value("${agora.app.certificate:}")
    private String appCertificate;

    @Value("${agora.token.expiration.seconds:3600}")
    private int tokenExpirationSeconds;

    public AgoraTokenResponse gerarToken(Integer usuarioId, String channelName) {
        validarConfiguracao();
        validarChannelName(usuarioId, channelName);

        RtcTokenBuilder2 tokenBuilder = new RtcTokenBuilder2();
        String token = tokenBuilder.buildTokenWithUid(
                appId,
                appCertificate,
                channelName,
                usuarioId,
                RtcTokenBuilder2.Role.ROLE_PUBLISHER,
                tokenExpirationSeconds,
                tokenExpirationSeconds
        );

        if (token == null || token.isBlank()) {
            throw new IllegalStateException("Nao foi possivel gerar token Agora");
        }

        return new AgoraTokenResponse(token, appId, channelName, usuarioId);
    }

    private void validarConfiguracao() {
        if (appId == null || appId.isBlank() || appCertificate == null || appCertificate.isBlank()) {
            throw new IllegalStateException("Agora nao configurado no backend");
        }
    }

    private void validarChannelName(Integer usuarioId, String channelName) {
        if (channelName == null || channelName.isBlank()) {
            throw new IllegalArgumentException("channelName e obrigatorio");
        }

        if (channelName.getBytes(StandardCharsets.UTF_8).length > 64) {
            throw new IllegalArgumentException("channelName deve ter no maximo 64 bytes");
        }

        Matcher matcher = CHAT_CHANNEL_PATTERN.matcher(channelName);
        if (!matcher.matches()) {
            throw new IllegalArgumentException("channelName invalido");
        }

        Integer userA = Integer.valueOf(matcher.group(1));
        Integer userB = Integer.valueOf(matcher.group(2));
        if (!usuarioId.equals(userA) && !usuarioId.equals(userB)) {
            throw new IllegalArgumentException("Usuario nao pertence ao canal");
        }
    }
}
