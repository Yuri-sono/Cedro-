package com.cedro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChamadaService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    public int contarChamadasMes(Integer usuarioId) {
        String sql = """
            SELECT COUNT(*) FROM chamadas_historico
            WHERE usuario_id = ?
            AND MONTH(data_chamada) = MONTH(GETDATE())
            AND YEAR(data_chamada) = YEAR(GETDATE())
        """;
        
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, usuarioId);
        return count != null ? count : 0;
    }
    
    public void registrarChamada(Integer usuarioId, String channelName, String tipo, Integer duracaoSegundos) {
        if (!"voz".equals(tipo) && !"video".equals(tipo)) {
            throw new IllegalArgumentException("Tipo de chamada invalido");
        }

        String sql = """
            INSERT INTO chamadas_historico (usuario_id, channel_name, tipo, duracao_segundos, data_chamada)
            VALUES (?, ?, ?, ?, GETDATE())
        """;
        
        jdbcTemplate.update(sql, usuarioId, channelName, tipo, duracaoSegundos);
    }
}
