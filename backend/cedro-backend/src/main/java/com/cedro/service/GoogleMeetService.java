package com.cedro.service;

import com.cedro.model.entity.Sessao;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.ConferenceData;
import com.google.api.services.calendar.model.CreateConferenceRequest;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.EntryPoint;
import com.google.api.services.calendar.model.ConferenceSolutionKey;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.UserCredentials;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class GoogleMeetService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleMeetService.class);
    private static final ZoneId ZONA_SAO_PAULO = ZoneId.of("America/Sao_Paulo");

    @Value("${google.meet.client.id}")
    private String clientId;

    @Value("${google.meet.client.secret}")
    private String clientSecret;

    @Value("${google.meet.refresh.token}")
    private String refreshToken;

    private Calendar calendarService;

    @PostConstruct
    public void inicializar() {
        try {
            UserCredentials credentials = UserCredentials.newBuilder()
                    .setClientId(clientId)
                    .setClientSecret(clientSecret)
                    .setRefreshToken(refreshToken)
                    .build();

            HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);
            calendarService = new Calendar.Builder(
                    com.google.api.client.googleapis.javanet.GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    requestInitializer
            ).setApplicationName("Cedro Plus").build();
        } catch (GeneralSecurityException | IOException e) {
            logger.error("Falha ao inicializar Google Calendar client", e);
            calendarService = null;
        }
    }

    public GoogleMeetResultado criarReuniao(Sessao sessao, String nomePaciente, String nomePsicologo) {
        if (calendarService == null) {
            logger.error("Google Calendar client indisponivel; nao foi possivel criar reuniao para a sessao {}", sessao.getId());
            return new GoogleMeetResultado(null, null);
        }

        try {
            LocalDateTime inicio = sessao.getDataSessao();
            LocalDateTime fim = inicio.plusMinutes(sessao.getDuracao() != null ? sessao.getDuracao() : 60);

            Event event = new Event()
                    .setSummary(String.format("Sessão Cedro Plus - %s & %s",
                            nomePaciente != null ? nomePaciente : "Paciente",
                            nomePsicologo != null ? nomePsicologo : "Psicólogo"));

            event.setStart(new EventDateTime()
                    .setDateTime(new DateTime(Date.from(inicio.atZone(ZONA_SAO_PAULO).toInstant())))
                    .setTimeZone(ZONA_SAO_PAULO.getId()));
            event.setEnd(new EventDateTime()
                    .setDateTime(new DateTime(Date.from(fim.atZone(ZONA_SAO_PAULO).toInstant())))
                    .setTimeZone(ZONA_SAO_PAULO.getId()));

            CreateConferenceRequest conferenceRequest = new CreateConferenceRequest()
                    .setRequestId(UUID.randomUUID().toString())
                    .setConferenceSolutionKey(new ConferenceSolutionKey().setType("hangoutsMeet"));

            event.setConferenceData(new ConferenceData().setCreateRequest(conferenceRequest));

            Event criado = calendarService.events()
                    .insert("primary", event)
                    .setConferenceDataVersion(1)
                    .execute();

            String link = criado.getHangoutLink();
            if (link == null && criado.getConferenceData() != null) {
                List<EntryPoint> entryPoints = criado.getConferenceData().getEntryPoints();
                if (entryPoints != null) {
                    link = entryPoints.stream()
                            .map(EntryPoint::getUri)
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null);
                }
            }

            return new GoogleMeetResultado(link, criado.getId());
        } catch (Exception e) {
            logger.error("Falha ao criar reuniao do Google Meet para a sessao {}", sessao.getId(), e);
            return new GoogleMeetResultado(null, null);
        }
    }

    public void cancelarReuniao(String googleEventId) {
        if (calendarService == null || googleEventId == null || googleEventId.isBlank()) {
            return;
        }

        try {
            calendarService.events().delete("primary", googleEventId).execute();
        } catch (GoogleJsonResponseException e) {
            int statusCode = e.getStatusCode();
            if (statusCode == 404 || statusCode == 410) {
                return;
            }
            logger.error("Falha ao cancelar reuniao do Google Meet {}", googleEventId, e);
        } catch (Exception e) {
            logger.error("Falha ao cancelar reuniao do Google Meet {}", googleEventId, e);
        }
    }

    public record GoogleMeetResultado(String link, String eventId) {}
}
