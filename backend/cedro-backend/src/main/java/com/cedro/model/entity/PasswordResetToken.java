package com.cedro.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "usuario_id", nullable = false)
    private Integer usuarioId;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "expira_em", nullable = false)
    private LocalDateTime expiraEm;

    @Column(nullable = false)
    private boolean usado = false;

    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    public PasswordResetToken() {}

    public PasswordResetToken(Integer usuarioId, String token, LocalDateTime expiraEm) {
        this.usuarioId = usuarioId;
        this.token = token;
        this.expiraEm = expiraEm;
    }

    public Integer getId() { return id; }
    public Integer getUsuarioId() { return usuarioId; }
    public String getToken() { return token; }
    public LocalDateTime getExpiraEm() { return expiraEm; }
    public boolean isUsado() { return usado; }
    public void setUsado(boolean usado) { this.usado = usado; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
}
