package com.cedro.repository;

import com.cedro.model.entity.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SessaoRepository extends JpaRepository<Sessao, Integer> {
    List<Sessao> findByPacienteId(Integer pacienteId);
    List<Sessao> findByPsicologoId(Integer psicologoId);
    List<Sessao> findByStatusSessao(String status);

    List<Sessao> findByPsicologoIdAndDataSessaoBetween(Integer psicologoId, LocalDateTime inicio, LocalDateTime fim);

    boolean existsByPsicologoIdAndDataSessaoAndStatusSessaoNot(Integer psicologoId, LocalDateTime dataSessao, String statusSessao);

    @Query("SELECT COUNT(DISTINCT s.pacienteId) FROM Sessao s WHERE s.psicologoId = ?1 AND s.statusSessao != 'cancelada'")
    long countPacientesAtivosByPsicologoId(Integer psicologoId);

    @Query("SELECT COALESCE(SUM(s.valor), 0) FROM Sessao s WHERE s.psicologoId = ?1 AND s.dataSessao BETWEEN ?2 AND ?3 AND s.statusSessao = 'realizada'")
    java.math.BigDecimal sumValorByPsicologoIdAndPeriodo(Integer psicologoId, LocalDateTime inicio, LocalDateTime fim);

    List<Sessao> findByPsicologoIdAndDataSessaoAfterOrderByDataSessaoAsc(Integer psicologoId, LocalDateTime agora);

    @Modifying
    @Query("DELETE FROM Sessao s WHERE s.pacienteId = ?1")
    void deleteByPacienteId(Integer pacienteId);

    @Modifying
    @Query("DELETE FROM Sessao s WHERE s.psicologoId = ?1")
    void deleteByPsicologoId(Integer psicologoId);
}
