package com.cedro.repository;

import com.cedro.model.entity.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensagemRepository extends JpaRepository<Mensagem, Integer> {
    
    @Query("SELECT m FROM Mensagem m WHERE (m.remetenteId = ?1 AND m.destinatarioId = ?2) OR (m.remetenteId = ?2 AND m.destinatarioId = ?1) ORDER BY m.dataCriacao ASC")
    List<Mensagem> findConversaBetween(Integer userId1, Integer userId2);
    
    List<Mensagem> findByDestinatarioIdAndLidaFalseOrderByDataCriacaoDesc(Integer destinatarioId);
    
    long countByDestinatarioIdAndLidaFalse(Integer destinatarioId);

    @Modifying
    @Query("DELETE FROM Mensagem m WHERE m.remetenteId = ?1")
    void deleteByRemetenteId(Integer remetenteId);

    @Modifying
    @Query("DELETE FROM Mensagem m WHERE m.destinatarioId = ?1")
    void deleteByDestinatarioId(Integer destinatarioId);
}