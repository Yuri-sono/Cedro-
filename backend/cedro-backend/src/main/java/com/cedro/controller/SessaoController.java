package com.cedro.controller;

import com.cedro.model.dto.SessaoRequest;
import com.cedro.model.entity.Sessao;
import com.cedro.security.JwtUtil;
import com.cedro.service.SessaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessoes")
public class SessaoController {

    @Autowired
    private SessaoService sessaoService;

    @Autowired
    private JwtUtil jwtUtil;

    private Integer getUserId(String authHeader) {
        return jwtUtil.extractUserId(authHeader.replace("Bearer ", ""));
    }

    private boolean isAdmin(String authHeader) {
        try {
            return "admin".equals(jwtUtil.extractTipoUsuario(authHeader.replace("Bearer ", "")));
        } catch (Exception e) { return false; }
    }

    @GetMapping
    public ResponseEntity<?> listarTodas(@RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return ResponseEntity.ok(sessaoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        Sessao sessao = sessaoService.buscarPorId(id);
        if (!isAdmin(authHeader)
                && !sessao.getPacienteId().equals(requesterId)
                && !sessao.getPsicologoId().equals(requesterId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }
        return ResponseEntity.ok(sessao);
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<Sessao>> listarMinhas(@RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        return ResponseEntity.ok(sessaoService.listarPorPaciente(userId));
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Sessao>> listarPorPaciente(
            @PathVariable Integer pacienteId,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        if (!isAdmin(authHeader) && !requesterId.equals(pacienteId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(sessaoService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/psicologo/{psicologoId}")
    public ResponseEntity<List<Sessao>> listarPorPsicologo(
            @PathVariable Integer psicologoId,
            @RequestHeader("Authorization") String authHeader) {
        Integer requesterId = getUserId(authHeader);
        if (!isAdmin(authHeader) && !requesterId.equals(psicologoId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(sessaoService.listarPorPsicologo(psicologoId));
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody SessaoRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        request.setPacienteId(userId);
        Sessao sessao = sessaoService.criar(request);
        return ResponseEntity.status(201).body(sessao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Integer id,
            @RequestBody SessaoRequest request,
            @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        return ResponseEntity.ok(sessaoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable Integer id,
            @RequestHeader("Authorization") String authHeader) {
        Integer userId = getUserId(authHeader);
        Sessao sessao = sessaoService.buscarPorId(id);
        if (!isAdmin(authHeader) && !sessao.getPacienteId().equals(userId)) {
            return ResponseEntity.status(403).body(Map.of("error", "Acesso negado"));
        }
        sessaoService.deletar(id);
        return ResponseEntity.ok(Map.of("message", "Deletada"));
    }
}
