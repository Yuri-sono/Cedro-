package com.cedro.model.entity;

import com.cedro.model.TipoUsuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nome;
    
    @NotBlank
    @Email
    @Size(max = 100)
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @JsonIgnore
    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;
    
    @Size(max = 20)
    private String telefone;
    
    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;
    
    @Size(max = 20)
    private String genero;
    
    @Size(max = 200)
    private String endereco;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_usuario", nullable = false)
    private TipoUsuario tipoUsuario = TipoUsuario.paciente;
    
    @Size(max = 100)
    private String especialidade;
    
    @Size(max = 20)
    private String crp;
    
    @Column(name = "preco_sessao", precision = 10, scale = 2)
    private BigDecimal precoSessao;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal avaliacao = BigDecimal.valueOf(5.0);
    
    @Column(name = "foto_url")
    private String fotoUrl;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    public Usuario() {}
    
    public Usuario(String nome, String email, String senhaHash, TipoUsuario tipoUsuario) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.tipoUsuario = tipoUsuario;
    }
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getSenhaHash() { return senhaHash; }
    public void setSenhaHash(String senhaHash) { this.senhaHash = senhaHash; }
    
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
    
    public TipoUsuario getTipoUsuario() { return tipoUsuario; }
    public void setTipoUsuario(TipoUsuario tipoUsuario) { this.tipoUsuario = tipoUsuario; }
    
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }
    
    public String getCrp() { return crp; }
    public void setCrp(String crp) { this.crp = crp; }
    
    public BigDecimal getPrecoSessao() { return precoSessao; }
    public void setPrecoSessao(BigDecimal precoSessao) { this.precoSessao = precoSessao; }
    
    public BigDecimal getAvaliacao() { return avaliacao; }
    public void setAvaliacao(BigDecimal avaliacao) { this.avaliacao = avaliacao; }
    
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
}