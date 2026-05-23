package com.cedro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

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
        String sqlCancel = """
            UPDATE assinaturas SET status = 'cancelada'
            WHERE usuario_id = ? AND status = 'ativa'
        """;
        jdbcTemplate.update(sqlCancel, usuarioId);
        
        String sqlInsert = """
            INSERT INTO assinaturas (usuario_id, status, plano, data_inicio)
            VALUES (?, 'ativa', 'premium_mensal', GETDATE())
        """;
        jdbcTemplate.update(sqlInsert, usuarioId);
    }
    
    public void cancelarAssinatura(Integer usuarioId) {
        String sql = """
            UPDATE assinaturas 
            SET status = 'cancelada', data_fim = GETDATE()
            WHERE usuario_id = ? AND status = 'ativa'
        """;
        jdbcTemplate.update(sql, usuarioId);
    }
}
