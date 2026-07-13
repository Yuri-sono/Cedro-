package com.cedro.model.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessoes")
public class Sessao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "paciente_id", nullable = false)
    private Integer pacienteId;
    
    @Column(name = "psicologo_id", nullable = false)
    private Integer psicologoId;
    
    @Column(name = "data_sessao", nullable = false)
    private LocalDateTime dataSessao;
    
    @Column(nullable = false)
    private Integer duracao = 60;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;
    
    @Column(name = "status_sessao", length = 20)
    private String statusSessao = "agendada";

    @Column(name = "link_reuniao")
    private String linkReuniao;

    @Column(name = "google_event_id")
    private String googleEventId;
    
    @Column(columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getPacienteId() { return pacienteId; }
    public void setPacienteId(Integer pacienteId) { this.pacienteId = pacienteId; }
    
    public Integer getPsicologoId() { return psicologoId; }
    public void setPsicologoId(Integer psicologoId) { this.psicologoId = psicologoId; }
    
    public LocalDateTime getDataSessao() { return dataSessao; }
    public void setDataSessao(LocalDateTime dataSessao) { this.dataSessao = dataSessao; }
    
    public Integer getDuracao() { return duracao; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }
    
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    
    public String getStatusSessao() { return statusSessao; }
    public void setStatusSessao(String statusSessao) { this.statusSessao = statusSessao; }

    public String getLinkReuniao() { return linkReuniao; }
    public void setLinkReuniao(String linkReuniao) { this.linkReuniao = linkReuniao; }

    public String getGoogleEventId() { return googleEventId; }
    public void setGoogleEventId(String googleEventId) { this.googleEventId = googleEventId; }
    
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}
