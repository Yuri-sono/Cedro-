package com.cedro.controller;

import com.cedro.repository.MensagemRepository;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import com.cedro.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private SessaoRepository sessaoRepository;
    @Autowired private MensagemRepository mensagemRepository;
    @Autowired private JwtUtil jwtUtil;

    private boolean isAdmin(String authHeader) {
        try {
            return "admin".equals(jwtUtil.extractTipoUsuario(authHeader.replace("Bearer ", "")));
        } catch (Exception e) { return false; }
    }

    @GetMapping("/usuarios")
    public ResponseEntity<?> listarTodos(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Integer requesterId = jwtUtil.extractUserId(token);
        String tipo = jwtUtil.extractTipoUsuario(token);
        if (!"admin".equals(tipo) && !requesterId.equals(id))
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> dados,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Integer requesterId = jwtUtil.extractUserId(token);
        String tipo = jwtUtil.extractTipoUsuario(token);
        if (!"admin".equals(tipo) && !requesterId.equals(id))
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (dados.get("nome") != null) usuario.setNome((String) dados.get("nome"));
                    // SEGURANÇA: Não permitir alteração de email via este endpoint
                    // Alteração de email requer fluxo de verificação específico
                    if (dados.get("telefone") != null) usuario.setTelefone((String) dados.get("telefone"));
                    if (dados.get("especialidade") != null) usuario.setEspecialidade((String) dados.get("especialidade"));
                    if (dados.get("tipoPsicologo") != null) usuario.setTipoPsicologo((String) dados.get("tipoPsicologo"));
                    if (dados.get("crp") != null) usuario.setCrp((String) dados.get("crp"));
                    if (dados.get("areaInteresse") != null) usuario.setAreaInteresse((String) dados.get("areaInteresse"));
                    if (dados.get("bio") != null) usuario.setBio((String) dados.get("bio"));
                    if (dados.get("genero") != null) usuario.setGenero((String) dados.get("genero"));
                    if (dados.get("precoSessao") != null)
                        usuario.setPrecoSessao(new java.math.BigDecimal(dados.get("precoSessao").toString()));
                    if (dados.get("dataNascimento") != null)
                        usuario.setDataNascimento(java.time.LocalDate.parse(dados.get("dataNascimento").toString()));
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/usuarios/{id}/ativar")
    public ResponseEntity<?> ativarDesativar(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setAtivo(body.get("ativo"));
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(Map.of("message", "ok"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/usuarios/{id}")
    @Transactional
    public ResponseEntity<?> deletar(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    sessaoRepository.deleteByPacienteId(id);
                    sessaoRepository.deleteByPsicologoId(id);
                    mensagemRepository.deleteByRemetenteId(id);
                    mensagemRepository.deleteByDestinatarioId(id);
                    usuarioRepository.delete(usuario);
                    return ResponseEntity.ok(Map.of("message", "Deletado"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
