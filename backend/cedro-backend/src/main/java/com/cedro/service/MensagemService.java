package com.cedro.service;

import com.cedro.model.dto.ConversaResumo;
import com.cedro.model.dto.MensagemRequest;
import com.cedro.model.entity.Mensagem;
import com.cedro.repository.MensagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MensagemService {

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Mensagem enviarMensagem(Integer remetenteId, MensagemRequest request) {
        Mensagem mensagem = new Mensagem();
        mensagem.setRemetenteId(remetenteId);
        mensagem.setDestinatarioId(request.getDestinatarioId());
        mensagem.setMensagem(request.getMensagem());

        return mensagemRepository.save(mensagem);
    }

    public List<Mensagem> listarConversa(Integer userId1, Integer userId2) {
        return mensagemRepository.findConversaBetween(userId1, userId2);
    }

    public List<Mensagem> listarMensagensNaoLidas(Integer usuarioId) {
        return mensagemRepository.findByDestinatarioIdAndLidaFalseOrderByDataCriacaoDesc(usuarioId);
    }

    public long contarMensagensNaoLidas(Integer usuarioId) {
        return mensagemRepository.countByDestinatarioIdAndLidaFalse(usuarioId);
    }

    public Mensagem buscarPorId(Integer mensagemId) {
        return mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));
    }

    public void marcarComoLida(Integer mensagemId) {
        Mensagem msg = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Não encontrada"));
        msg.setLida(true);
        mensagemRepository.save(msg);
    }

    public void marcarTodasComoLidas(Integer usuarioId, Integer remetenteId) {
        List<Mensagem> msgs = mensagemRepository.findConversaBetween(usuarioId, remetenteId);
        msgs.stream()
            .filter(m -> m.getDestinatarioId().equals(usuarioId) && !m.getLida())
            .forEach(m -> {
                m.setLida(true);
                mensagemRepository.save(m);
            });
    }

    /**
     * Lista conversas agrupadas por usuário com última mensagem e contador de não lidas
     */
    public List<ConversaResumo> listarConversas(Integer usuarioId) {
        String sql = """
            WITH base AS (
                SELECT
                    CASE WHEN remetente_id = ? THEN destinatario_id ELSE remetente_id END AS outro_usuario_id,
                    mensagem,
                    data_criacao,
                    remetente_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY CASE WHEN remetente_id = ? THEN destinatario_id ELSE remetente_id END
                        ORDER BY data_criacao DESC, id DESC
                    ) AS rn
                FROM mensagens
                WHERE remetente_id = ? OR destinatario_id = ?
            ),
            nao_lidas AS (
                SELECT remetente_id, COUNT(*) AS total
                FROM mensagens
                WHERE destinatario_id = ? AND lida = 0
                GROUP BY remetente_id
            )
            SELECT
                b.outro_usuario_id AS userId,
                u.nome,
                u.foto_url AS fotoUrl,
                b.mensagem AS ultimaMensagem,
                b.data_criacao AS dataUltimaMensagem,
                COALESCE(n.total, 0) AS naoLidas,
                CASE WHEN b.remetente_id = ? THEN 1 ELSE 0 END AS mensagemEnviada
            FROM base b
            JOIN usuarios u ON u.id = b.outro_usuario_id
            LEFT JOIN nao_lidas n ON n.remetente_id = b.outro_usuario_id
            WHERE b.rn = 1
            ORDER BY b.data_criacao DESC
        """;

        return jdbcTemplate.query(sql,
            (rs, rowNum) -> new ConversaResumo(
                rs.getInt("userId"),
                rs.getString("nome"),
                rs.getString("fotoUrl"),
                rs.getString("ultimaMensagem"),
                rs.getString("dataUltimaMensagem"),
                rs.getInt("naoLidas"),
                rs.getBoolean("mensagemEnviada")
            ),
            usuarioId, usuarioId, usuarioId, usuarioId, usuarioId, usuarioId
        );
    }
}
