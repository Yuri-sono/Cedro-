package com.cedro.controller;

import com.cedro.model.dto.*;
import com.cedro.security.JwtUtil;
import com.cedro.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${cedro.upload.dir:uploads}")
    private String uploadDir;

    private static final long MAX_PROFILE_PHOTO_BYTES = 2_000_000;
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

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

        String senhaTemporaria = authService.recuperarSenha(email);
        return ResponseEntity.ok(Map.of(
                "message", "Senha temporaria gerada com sucesso",
                "senhaTemporaria", senhaTemporaria
        ));
    }

    @PutMapping("/foto-perfil")
    public ResponseEntity<?> updateFotoPerfil(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        String token = authHeader.replace("Bearer ", "");
        Integer userId = jwtUtil.extractUserId(token);
        String fotoUrl = request.get("fotoUrl") != null ? request.get("fotoUrl") : request.get("foto_url");
        authService.updateFotoPerfil(userId, fotoUrl);
        return ResponseEntity.ok(Map.of("message", "Foto atualizada"));
    }

    @PostMapping(value = "/foto-perfil-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadFotoPerfil(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart("file") MultipartFile file) throws IOException {
        try {
            String token = authHeader.replace("Bearer ", "");
            Integer userId = jwtUtil.extractUserId(token);

            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Arquivo de imagem obrigatorio"));
            }

            if (file.getSize() > MAX_PROFILE_PHOTO_BYTES) {
                return ResponseEntity.badRequest().body(Map.of("error", "Imagem muito grande (max. 2MB)"));
            }

            String contentType = file.getContentType() != null
                    ? file.getContentType().toLowerCase(Locale.ROOT)
                    : "";
            if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Formato invalido. Use JPG, PNG ou WebP"));
            }

            String extension = switch (contentType) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
            };

            Path profileDir = Paths.get(uploadDir).toAbsolutePath().normalize().resolve("perfil");
            Files.createDirectories(profileDir);

            String fileName = "usuario-" + userId + "-" + UUID.randomUUID() + extension;
            Path destination = profileDir.resolve(fileName).normalize();
            if (!destination.startsWith(profileDir)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nome de arquivo invalido"));
            }

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String fotoUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/perfil/")
                    .path(fileName)
                    .toUriString();
            authService.updateFotoPerfil(userId, fotoUrl);

            return ResponseEntity.ok(Map.of(
                    "message", "Foto atualizada",
                    "fotoUrl", fotoUrl
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Nao foi possivel salvar a foto no servidor"
            ));
        }
    }
}
