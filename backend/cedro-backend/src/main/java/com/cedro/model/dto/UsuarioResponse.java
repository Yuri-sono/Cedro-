package com.cedro.model.dto;

import com.cedro.model.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;

public class UsuarioResponse {
    
    private Integer id;
    private String nome;
    private String email;
    
    @JsonProperty("tipoUsuario")
    private TipoUsuario tipoUsuario;
    
    private String telefone;
    
    @JsonProperty("dataNascimento")
    private LocalDate dataNascimento;
    
    private String genero;
    private String endereco;
    private String bio;
    
    @JsonProperty("fotoUrl")
    private String fotoUrl;
    
    private String especialidade;
    
    @JsonProperty("precoSessao")
    private BigDecimal precoSessao;
    
    public UsuarioResponse() {}
    
    public UsuarioResponse(Integer id, String nome, String email, TipoUsuario tipoUsuario,
                          String telefone, LocalDate dataNascimento, String genero, 
                          String endereco, String bio, String fotoUrl, String especialidade, BigDecimal precoSessao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.tipoUsuario = tipoUsuario;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.genero = genero;
        this.endereco = endereco;
        this.bio = bio;
        this.fotoUrl = fotoUrl;
        this.especialidade = especialidade;
        this.precoSessao = precoSessao;
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
    
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    
    public BigDecimal getPrecoSessao() { return precoSessao; }
    public void setPrecoSessao(BigDecimal precoSessao) { this.precoSessao = precoSessao; }
}