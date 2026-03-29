package com.cedro.service;

import com.cedro.model.dto.MensagemRequest;
import com.cedro.model.entity.Mensagem;
import com.cedro.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensagemService {
    
    @Autowired
    private MensagemRepository mensagemRepository;
    
    public Mensagem enviarMensagem(Integer remetenteId, MensagemRequest request) {
        Mensagem mensagem = new Mensagem();
        mensagem.setRemetenteId(remetenteId);
        mensagem.setDestinatarioId(request.getDestinatarioId());
        mensagem.setMensagem(request.getMensagem());
        
        return mensagemRepository.save(mensagem);
    }
    
    public List<Mensagem> listarConversa(Integer userId1, Integer userId2) {
        return mensagemRepository.findConversaBetween(userId1, userId2);
    }
    
    public List<Mensagem> listarMensagensNaoLidas(Integer usuarioId) {
        return mensagemRepository.findByDestinatarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId);
    }
    
    public long contarMensagensNaoLidas(Integer usuarioId) {
        return mensagemRepository.countByDestinatarioIdAndLidaFalse(usuarioId);
    }
    
    public Mensagem buscarPorId(Integer mensagemId) {
        return mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));
    }

    public void marcarComoLida(Integer mensagemId) {
        Mensagem msg = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Não encontrada"));
        msg.setLida(true);
        mensagemRepository.save(msg);
    }
    
    public void marcarTodasComoLidas(Integer usuarioId, Integer remetenteId) {
        List<Mensagem> msgs = mensagemRepository.findConversaBetween(usuarioId, remetenteId);
        msgs.stream()
            .filter(m -> m.getDestinatarioId().equals(usuarioId) && !m.getLida())
            .forEach(m -> {
                m.setLida(true);
                mensagemRepository.save(m);
            });
    }
}