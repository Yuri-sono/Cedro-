package com.cedro.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
public class Mensagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "remetente_id", nullable = false)
    private Integer remetenteId;
    
    @Column(name = "destinatario_id", nullable = false)
    private Integer destinatarioId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;
    
    @Column(nullable = false)
    private Boolean lida = false;
    
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getRemetenteId() { return remetenteId; }
    public void setRemetenteId(Integer remetenteId) { this.remetenteId = remetenteId; }
    
    public Integer getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(Integer destinatarioId) { this.destinatarioId = destinatarioId; }
    
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
    
    public Boolean getLida() { return lida; }
    public void setLida(Boolean lida) { this.lida = lida; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}