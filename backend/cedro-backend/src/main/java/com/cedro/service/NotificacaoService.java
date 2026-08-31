package com.cedro.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cedro.model.entity.Sessao;
import com.cedro.repository.SessaoRepository;

@Service
public class NotificacaoService {

    private static final Logger logger = LoggerFactory.getLogger(NotificacaoService.class);

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
    private static final ZoneId ZONE_SAO_PAULO = ZoneId.of("America/Sao_Paulo");
    private static final int[] INTERVALOS_LEMBRETE_MINUTOS = { 60, 30, 15, 10, 5 };

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SessaoRepository sessaoRepository;

    public void registrarToken(Integer usuarioId, String token) {
        String sqlCheck = "SELECT COUNT(*) FROM push_tokens WHERE usuario_id = ? AND token = ?";
        Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, usuarioId, token);

        if (count == null || count == 0) {
            String sqlInsert = """
                INSERT INTO push_tokens (usuario_id, token, data_registro)
                VALUES (?, ?, GETDATE())
            """;
            jdbcTemplate.update(sqlInsert, usuarioId, token);
        }
    }

    public void removerToken(Integer usuarioId, String token) {
        String sql = "DELETE FROM push_tokens WHERE usuario_id = ? AND token = ?";
        jdbcTemplate.update(sql, usuarioId, token);
    }

    /**
     * Envia um push via Expo Push API. Não lança exceção — falhas são apenas logadas.
     */
    private void enviarPushExpo(String token, String titulo, String corpo) {
        try {
            String body = String.format(
                "{\"to\":\"%s\",\"title\":\"%s\",\"body\":\"%s\",\"sound\":\"default\"}",
                token.replace("\"", "\\\""),
                titulo.replace("\"", "\\\""),
                corpo.replace("\"", "\\\"")
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(EXPO_PUSH_URL))
                    .timeout(Duration.ofSeconds(15))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                logger.warn("Expo Push falhou para token {}: status {} - {}", token, response.statusCode(), response.body());
            } else {
                logger.debug("Push enviado para token {}: {}", token, response.body());
            }
        } catch (Exception e) {
            logger.warn("Erro ao enviar push Expo para token {}: {}", token, e.getMessage());
        }
    }

    /**
     * Envia o push para todos os tokens registrados de um usuário.
     */
    public void enviarParaUsuario(Integer usuarioId, String titulo, String corpo) {
        if (usuarioId == null) {
            return;
        }

        List<String> tokens = jdbcTemplate.queryForList(
            "SELECT token FROM push_tokens WHERE usuario_id = ?", String.class, usuarioId
        );

        for (String token : tokens) {
            if (token != null && !token.isBlank()) {
                enviarPushExpo(token, titulo, corpo);
            }
        }
    }

    /**
     * Verifica a cada 60s sessões "agendada" que começam em ~60/30/15/10/5 minutos
     * e envia lembretes para paciente e psicólogo.
     */
    @Scheduled(fixedDelay = 60000)
    public void verificarLembretes() {
        LocalDateTime agora = LocalDateTime.now(ZONE_SAO_PAULO);

        for (int intervalo : INTERVALOS_LEMBRETE_MINUTOS) {
            LocalDateTime inicio = agora.plusMinutes(intervalo - 1);
            LocalDateTime fim = agora.plusMinutes(intervalo + 1);

            List<Sessao> sessoes = sessaoRepository
                .findByStatusSessaoAndDataSessaoBetween("agendada", inicio, fim);

            for (Sessao s : sessoes) {
                String titulo = "Sessão em " + intervalo + " minutos";
                String corpo = "Sua sessão começa em " + intervalo + " minutos. Prepare-se!";
                logger.info("Enviando lembrete de sessão {}: pacienteId={}, psicologoId={}", s.getId(), s.getPacienteId(), s.getPsicologoId());
                enviarParaUsuario(s.getPacienteId(), titulo, corpo);
                enviarParaUsuario(s.getPsicologoId(), titulo, corpo);
            }
        }
    }
}
