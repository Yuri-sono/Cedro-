package com.cedro.controller;

import com.cedro.model.dto.*;
import com.cedro.security.JwtUtil;
import com.cedro.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(201).body(Map.of("message", "Conta criada!"));
    }
    
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        String idToken = request.get("credential");
        
        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token do Google não fornecido"));
        }
        
        try {
            LoginResponse response = authService.googleLoginWithToken(idToken);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }
    
    @PutMapping("/perfil")
    public ResponseEntity<?> updatePerfil(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdatePerfilRequest request) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = jwtUtil.extractUserId(token);
        
        authService.updatePerfil(userId, request);
        return ResponseEntity.ok(Map.of("message", "Perfil atualizado"));
    }
    
    @PutMapping("/alterar-senha")
    public ResponseEntity<?> alterarSenha(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody AlterarSenhaRequest request) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = jwtUtil.extractUserId(token);
        
        authService.alterarSenha(userId, request);
        return ResponseEntity.ok(Map.of("message", "Senha alterada"));
    }
    
    @DeleteMapping("/conta")
    public ResponseEntity<?> excluirConta(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = jwtUtil.extractUserId(token);
        
        authService.excluirConta(userId);
        return ResponseEntity.ok(Map.of("message", "Conta excluída"));
    }
    
    @PostMapping("/recuperar-senha")
    public ResponseEntity<?> recuperarSenha(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Informe o email"));
        }
        
        authService.recuperarSenha(email);
        return ResponseEntity.ok(Map.of("message", "Nova senha enviada (verifique o console)"));
    }
    
    @PutMapping("/foto-perfil")
    public ResponseEntity<?> updateFotoPerfil(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = jwtUtil.extractUserId(token);
        String fotoUrl = request.get("fotoUrl") != null ? request.get("fotoUrl") : request.get("foto_url");
        if (fotoUrl != null && fotoUrl.length() > 2_000_000)
            return ResponseEntity.badRequest().body(Map.of("error", "Imagem muito grande (máx. 1.5MB)"));
        authService.updateFotoPerfil(userId, fotoUrl);
        return ResponseEntity.ok(Map.of("message", "Foto atualizada"));
    }
}