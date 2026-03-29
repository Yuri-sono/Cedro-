package com.cedro.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MensagemRequest {
    
    @NotNull
    private Integer destinatarioId;
    
    @NotBlank
    @Size(max = 2000, message = "Mensagem muito longa (máx. 2000 caracteres)")
    private String mensagem;
    
    public MensagemRequest() {}
    
    public Integer getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(Integer destinatarioId) { this.destinatarioId = destinatarioId; }
    
    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
}