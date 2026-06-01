package com.cedro.model.dto;

import com.cedro.model.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class RegisterRequest {
    
    @NotBlank
    @Size(max = 100)
    private String nome;
    
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    
    @NotBlank
    @Size(min = 6)
    private String senha;
    
    @JsonProperty("dataNascimento")
    private LocalDate dataNascimento;
    private String genero;
    private String telefone;
    
    @JsonProperty(value = "tipoUsuario", access = JsonProperty.Access.WRITE_ONLY)
    private TipoUsuario tipoUsuario = TipoUsuario.paciente;
    
    private String especialidade;
    
    private String tipoPsicologo;
    
    private String crp;

    private String areaInteresse;
    
    @JsonProperty("precoSessao")
    private java.math.BigDecimal precoSessao;
    
    public RegisterRequest() {}
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }

    public String getTipoPsicologo() { return tipoPsicologo; }
    public void setTipoPsicologo(String tipoPsicologo) { this.tipoPsicologo = tipoPsicologo; }
    
    public String getCrp() { return crp; }
    public void setCrp(String crp) { this.crp = crp; }

    public String getAreaInteresse() { return areaInteresse; }
    public void setAreaInteresse(String areaInteresse) { this.areaInteresse = areaInteresse; }
    
    public java.math.BigDecimal getPrecoSessao() { return precoSessao; }
    public void setPrecoSessao(java.math.BigDecimal precoSessao) { this.precoSessao = precoSessao; }
}
