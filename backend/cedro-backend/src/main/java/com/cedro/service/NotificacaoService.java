package com.cedro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificacaoService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public void registrarToken(Integer usuarioId, String token) {
        String sqlCheck = "SELECT COUNT(*) FROM push_tokens WHERE usuario_id = ? AND token = ?";
        Integer count = jdbcTemplate.queryForObject(sqlCheck, Integer.class, usuarioId, token);
        
        if (count == null || count == 0) {
            String sqlInsert = """
                INSERT INTO push_tokens (usuario_id, token, data_registro)
                VALUES (?, ?, GETDATE())
            """;
            jdbcTemplate.update(sqlInsert, usuarioId, token);
        }
    }
    
    public void removerToken(Integer usuarioId, String token) {
        String sql = "DELETE FROM push_tokens WHERE usuario_id = ? AND token = ?";
        jdbcTemplate.update(sql, usuarioId, token);
    }
}
