package com.cedro.model.dto;

public class ConversaResumo {
    private Integer userId;
    private String nome;
    private String fotoUrl;
    private String ultimaMensagem;
    private String dataUltimaMensagem;
    private Integer naoLidas;
    private Boolean mensagemEnviada;

    public ConversaResumo() {}

    public ConversaResumo(Integer userId, String nome, String fotoUrl, String ultimaMensagem, 
                          String dataUltimaMensagem, Integer naoLidas, Boolean mensagemEnviada) {
        this.userId = userId;
        this.nome = nome;
        this.fotoUrl = fotoUrl;
        this.ultimaMensagem = ultimaMensagem;
        this.dataUltimaMensagem = dataUltimaMensagem;
        this.naoLidas = naoLidas;
        this.mensagemEnviada = mensagemEnviada;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getUltimaMensagem() {
        return ultimaMensagem;
    }

    public void setUltimaMensagem(String ultimaMensagem) {
        this.ultimaMensagem = ultimaMensagem;
    }

    public String getDataUltimaMensagem() {
        return dataUltimaMensagem;
    }

    public void setDataUltimaMensagem(String dataUltimaMensagem) {
        this.dataUltimaMensagem = dataUltimaMensagem;
    }

    public Integer getNaoLidas() {
        return naoLidas;
    }

    public void setNaoLidas(Integer naoLidas) {
        this.naoLidas = naoLidas;
    }

    public Boolean getMensagemEnviada() {
        return mensagemEnviada;
    }

    public void setMensagemEnviada(Boolean mensagemEnviada) {
        this.mensagemEnviada = mensagemEnviada;
    }
}
