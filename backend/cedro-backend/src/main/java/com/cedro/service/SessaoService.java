package com.cedro.service;

import com.cedro.model.dto.SessaoRequest;
import com.cedro.model.entity.Sessao;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class SessaoService {

    private static final ZoneId ZONA_SAO_PAULO = ZoneId.of("America/Sao_Paulo");
    private static final int LIMITE_SESSOES_GRATIS_MES = 4;

    @Autowired
    private SessaoRepository sessaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private GoogleMeetService googleMeetService;

    @Autowired
    private AssinaturaService assinaturaService;

    public List<Sessao> listarTodas() {
        return sessaoRepository.findAll();
    }

    public List<Sessao> listarPorPaciente(Integer pacienteId) {
        return sessaoRepository.findByPacienteId(pacienteId);
    }

    public List<Sessao> listarPorPsicologo(Integer psicologoId) {
        return sessaoRepository.findByPsicologoId(psicologoId);
    }

    public Sessao buscarPorId(Integer id) {
        return sessaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Não encontrada"));
    }

    public Sessao criar(SessaoRequest request) {
        Usuario psicologo = usuarioRepository.findById(request.getPsicologoId())
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        validarLimiteSessoesGratuitas(request.getPacienteId());

        boolean horarioOcupado = sessaoRepository.existsByPsicologoIdAndDataSessaoAndStatusSessaoNot(
                request.getPsicologoId(),
                request.getDataSessao(),
                "cancelada"
        );
        if (horarioOcupado) {
            throw new RuntimeException("Horario indisponivel");
        }

        Sessao sessao = new Sessao();
        sessao.setPacienteId(request.getPacienteId());
        sessao.setPsicologoId(request.getPsicologoId());
        sessao.setDataSessao(request.getDataSessao());
        sessao.setValor(psicologo.getPrecoSessao());
        if (request.getDuracao() != null) sessao.setDuracao(request.getDuracao());
        if (request.getStatusSessao() != null) sessao.setStatusSessao(request.getStatusSessao());
        if (request.getObservacoes() != null) sessao.setObservacoes(request.getObservacoes());
        return sessaoRepository.save(sessao);
    }

    private void validarLimiteSessoesGratuitas(Integer pacienteId) {
        if (pacienteId == null || assinaturaService.isPremium(pacienteId)) {
            return;
        }

        LocalDateTime inicioMes = LocalDate.now(ZONA_SAO_PAULO)
                .withDayOfMonth(1)
                .atStartOfDay();
        LocalDateTime inicioProximoMes = inicioMes.plusMonths(1);

        long sessoesAgendadasNoMes = sessaoRepository.countByPacienteIdAndDataCriacaoBetweenAndStatusSessaoNot(
                pacienteId,
                inicioMes,
                inicioProximoMes,
                "cancelada"
        );

        if (sessoesAgendadasNoMes >= LIMITE_SESSOES_GRATIS_MES) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Voce atingiu o limite de " + LIMITE_SESSOES_GRATIS_MES
                            + " sessoes agendadas neste mes no plano gratuito."
            );
        }
    }

    public Sessao atualizar(Integer id, SessaoRequest request) {
        Sessao sessao = buscarPorId(id);
        if (request.getDataSessao() != null) sessao.setDataSessao(request.getDataSessao());
        if (request.getDuracao() != null) sessao.setDuracao(request.getDuracao());
        if (request.getValor() != null) sessao.setValor(request.getValor());
        if (request.getStatusSessao() != null) {
            if ("cancelada".equals(request.getStatusSessao()) && sessao.getGoogleEventId() != null) {
                googleMeetService.cancelarReuniao(sessao.getGoogleEventId());
            }
            sessao.setStatusSessao(request.getStatusSessao());
        }
        if (request.getObservacoes() != null) sessao.setObservacoes(request.getObservacoes());
        return sessaoRepository.save(sessao);
    }

    public Map<String, Object> consultarDisponibilidade(Integer psicologoId, LocalDate data) {
        Usuario psicologo = usuarioRepository.findById(psicologoId)
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        int diaDaSemana = data.getDayOfWeek().getValue() % 7; // 0=Domingo a 6=Sábado

        List<String> diasConfigurados = splitLista(psicologo.getDiasAtendimento());
        List<String> horariosConfigurados = splitLista(psicologo.getHorariosAtendimento());
        boolean temConfiguracao = !diasConfigurados.isEmpty() && !horariosConfigurados.isEmpty();

        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.plusDays(1).atStartOfDay().minusNanos(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        List<String> horariosOcupados = sessaoRepository
                .findByPsicologoIdAndDataSessaoBetween(psicologoId, inicio, fim)
                .stream()
                .filter(sessao -> !"cancelada".equals(sessao.getStatusSessao()))
                .map(sessao -> sessao.getDataSessao().format(formatter))
                .toList();

        // Sem configuração: usa a lista fixa como fallback (compatibilidade com
        // psicólogos que ainda não configuraram dias/horários).
        List<String> horariosBase = List.of("08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00");
        List<String> candidatos = temConfiguracao ? horariosConfigurados : horariosBase;

        if (temConfiguracao && !diasConfigurados.contains(String.valueOf(diaDaSemana))) {
            return Map.of(
                    "data", data.toString(),
                    "atendeNesteDia", false,
                    "horariosDisponiveis", List.of(),
                    "horariosOcupados", horariosOcupados
            );
        }

        List<String> horariosDisponiveis = candidatos.stream()
                .filter(horario -> !horariosOcupados.contains(horario))
                .toList();

        return Map.of(
                "data", data.toString(),
                "atendeNesteDia", true,
                "horariosDisponiveis", horariosDisponiveis,
                "horariosOcupados", horariosOcupados
        );
    }

    private List<String> splitLista(String valor) {
        if (valor == null || valor.isBlank()) return List.of();
        return java.util.Arrays.stream(valor.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public Sessao confirmarPagamento(Integer id, Integer pacienteId) {
        Sessao sessao = buscarPorId(id);
        if (!sessao.getPacienteId().equals(pacienteId)) {
            throw new RuntimeException("Acesso negado. Paciente não corresponde à sessão.");
        }
        sessao.setStatusSessao("agendada");
        Sessao salva = sessaoRepository.save(sessao);

        Usuario paciente = usuarioRepository.findById(salva.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        Usuario psicologo = usuarioRepository.findById(salva.getPsicologoId())
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));

        GoogleMeetService.GoogleMeetResultado resultado = googleMeetService.criarReuniao(
                salva,
                paciente.getNome(),
                psicologo.getNome()
        );

        if (resultado != null && (resultado.link() != null || resultado.eventId() != null)) {
            salva.setLinkReuniao(resultado.link());
            salva.setGoogleEventId(resultado.eventId());
            salva = sessaoRepository.save(salva);
        }

        return salva;
    }

    public Sessao salvarReuniaoGerada(Sessao sessao, String linkReuniao, String googleEventId) {
        if (linkReuniao != null) {
            sessao.setLinkReuniao(linkReuniao);
        }
        if (googleEventId != null) {
            sessao.setGoogleEventId(googleEventId);
        }
        return sessaoRepository.save(sessao);
    }

    public void deletar(Integer id) {
        Sessao sessao = buscarPorId(id);
        if (sessao.getGoogleEventId() != null) {
            googleMeetService.cancelarReuniao(sessao.getGoogleEventId());
        }
        sessaoRepository.delete(sessao);
    }

    public Sessao atualizarStatusCancelado(Sessao sessao) {
        if (sessao.getGoogleEventId() != null) {
            googleMeetService.cancelarReuniao(sessao.getGoogleEventId());
        }
        sessao.setStatusSessao("cancelada");
        return sessaoRepository.save(sessao);
    }

    public Sessao atualizarStatusRealizada(Sessao sessao) {
        sessao.setStatusSessao("realizada");
        return sessaoRepository.save(sessao);
    }
}
