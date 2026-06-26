package com.cedro.service;

import com.cedro.model.dto.SessaoRequest;
import com.cedro.model.entity.Sessao;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class SessaoService {
    
    @Autowired
    private SessaoRepository sessaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;
    
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
        // Buscar o preço do psicólogo
        Usuario psicologo = usuarioRepository.findById(request.getPsicologoId())
                .orElseThrow(() -> new RuntimeException("Psicólogo não encontrado"));
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
        // Usar o preço definido pelo psicólogo, não o enviado pelo cliente
        sessao.setValor(psicologo.getPrecoSessao());
        if (request.getDuracao() != null) sessao.setDuracao(request.getDuracao());
        if (request.getStatusSessao() != null) sessao.setStatusSessao(request.getStatusSessao());
        if (request.getObservacoes() != null) sessao.setObservacoes(request.getObservacoes());
        return sessaoRepository.save(sessao);
    }
    
    public Sessao atualizar(Integer id, SessaoRequest request) {
        Sessao sessao = buscarPorId(id);
        if (request.getDataSessao() != null) sessao.setDataSessao(request.getDataSessao());
        if (request.getDuracao() != null) sessao.setDuracao(request.getDuracao());
        if (request.getValor() != null) sessao.setValor(request.getValor());
        if (request.getStatusSessao() != null) sessao.setStatusSessao(request.getStatusSessao());
        if (request.getObservacoes() != null) sessao.setObservacoes(request.getObservacoes());
        return sessaoRepository.save(sessao);
    }

    public Map<String, Object> consultarDisponibilidade(Integer psicologoId, LocalDate data) {
        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.plusDays(1).atStartOfDay().minusNanos(1);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

        List<String> horariosOcupados = sessaoRepository
                .findByPsicologoIdAndDataSessaoBetween(psicologoId, inicio, fim)
                .stream()
                .filter(sessao -> !"cancelada".equals(sessao.getStatusSessao()))
                .map(sessao -> sessao.getDataSessao().format(formatter))
                .toList();

        List<String> horariosBase = List.of("08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00");
        List<String> horariosDisponiveis = horariosBase.stream()
                .filter(horario -> !horariosOcupados.contains(horario))
                .toList();

        return Map.of(
                "data", data.toString(),
                "horariosDisponiveis", horariosDisponiveis,
                "horariosOcupados", horariosOcupados
        );
    }

    public Sessao confirmarPagamento(Integer id, Integer pacienteId) {
        Sessao sessao = buscarPorId(id);
        if (!sessao.getPacienteId().equals(pacienteId)) {
            throw new RuntimeException("Acesso negado. Paciente não corresponde à sessão.");
        }
        sessao.setStatusSessao("agendada");
        return sessaoRepository.save(sessao);
    }
    
    public void deletar(Integer id) {
        Sessao sessao = buscarPorId(id);
        sessaoRepository.delete(sessao);
    }
}
