package com.cedro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class AssinaturaService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public boolean isPremium(Integer usuarioId) {
        String sql = """
            SELECT COUNT(*) FROM assinaturas
            WHERE usuario_id = ?
            AND status = 'ativa'
            AND (data_fim IS NULL OR data_fim > GETDATE())
        """;
        
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, usuarioId);
        return count != null && count > 0;
    }
    
    public void ativarAssinatura(Integer usuarioId) {
        ativarAssinatura(usuarioId, null, null, null, null);
    }

    public void ativarAssinatura(
            Integer usuarioId,
            String appUserId,
            String productId,
            String transactionId,
            Long expirationAtMs) {
        String sqlCancel = """
            UPDATE assinaturas SET status = 'cancelada', data_atualizacao = GETDATE()
            WHERE usuario_id = ? AND status = 'ativa'
        """;
        jdbcTemplate.update(sqlCancel, usuarioId);

        LocalDateTime dataFim = expirationAtMs == null
                ? null
                : LocalDateTime.ofInstant(Instant.ofEpochMilli(expirationAtMs), ZoneId.systemDefault());
        
        String sqlInsert = """
            INSERT INTO assinaturas (
                usuario_id, status, plano, revenuecat_app_user_id,
                revenuecat_product_id, revenuecat_transaction_id, data_inicio, data_fim
            )
            VALUES (?, 'ativa', 'premium_mensal', ?, ?, ?, GETDATE(), ?)
        """;
        jdbcTemplate.update(sqlInsert, usuarioId, appUserId, productId, transactionId, dataFim);
    }
    
    public void cancelarAssinatura(Integer usuarioId) {
        atualizarStatus(usuarioId, "cancelada");
    }

    public void expirarAssinatura(Integer usuarioId) {
        atualizarStatus(usuarioId, "expirada");
    }

    private void atualizarStatus(Integer usuarioId, String status) {
        String sql = """
            UPDATE assinaturas 
            SET status = ?, data_fim = COALESCE(data_fim, GETDATE()), data_atualizacao = GETDATE()
            WHERE usuario_id = ? AND status = 'ativa'
        """;
        jdbcTemplate.update(sql, status, usuarioId);
    }
}
