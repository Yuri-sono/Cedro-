package com.cedro.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SessaoRequest {

    @JsonProperty("psicologoId")
    @NotNull(message = "psicologoId é obrigatório")
    private Integer psicologoId;

    // pacienteId é preenchido pelo controller via token, não pelo cliente
    @JsonProperty("pacienteId")
    private Integer pacienteId;

    @JsonProperty("dataSessao")
    @NotNull(message = "dataSessao é obrigatória")
    private LocalDateTime dataSessao;

    private Integer duracao;

    // valor é preenchido automaticamente pelo backend baseado no preço do psicólogo
    private BigDecimal valor;

    @JsonProperty("statusSessao")
    private String statusSessao;

    private String observacoes;
    
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
    
    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }
}
