package com.cedro.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class PsicologoResponse {
    
    private Integer id;
    private String nome;
    private String email;
    private String telefone;
    private String bio;
    private String especialidade;
    
    @JsonProperty("precoSessao")
    private BigDecimal precoSessao;
    
    private BigDecimal avaliacao;
    
    @JsonProperty("fotoUrl")
    private String fotoUrl;
    
    public PsicologoResponse() {}
    
    public PsicologoResponse(Integer id, String nome, String email, String telefone, 
                            String bio, String especialidade, BigDecimal precoSessao, 
                            BigDecimal avaliacao, String fotoUrl) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.bio = bio;
        this.especialidade = especialidade;
        this.precoSessao = precoSessao;
        this.avaliacao = avaliacao;
        this.fotoUrl = fotoUrl;
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    
    public BigDecimal getPrecoSessao() { return precoSessao; }
    public void setPrecoSessao(BigDecimal precoSessao) { this.precoSessao = precoSessao; }
    
    public BigDecimal getAvaliacao() { return avaliacao; }
    public void setAvaliacao(BigDecimal avaliacao) { this.avaliacao = avaliacao; }
    
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
}
