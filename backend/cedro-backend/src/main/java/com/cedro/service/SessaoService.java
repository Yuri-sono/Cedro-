package com.cedro.service;

import com.cedro.model.dto.SessaoRequest;
import com.cedro.model.entity.Sessao;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
    
    public void deletar(Integer id) {
        Sessao sessao = buscarPorId(id);
        sessaoRepository.delete(sessao);
    }
}
