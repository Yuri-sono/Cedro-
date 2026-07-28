package com.cedro.service;

import com.cedro.model.TipoUsuario;
import com.cedro.model.dto.AlterarSenhaRequest;
import com.cedro.model.dto.LoginRequest;
import com.cedro.model.dto.LoginResponse;
import com.cedro.model.dto.RedefinirSenhaRequest;
import com.cedro.model.dto.RegisterRequest;
import com.cedro.model.dto.UpdatePerfilRequest;
import com.cedro.model.dto.UsuarioResponse;
import com.cedro.model.entity.PasswordResetToken;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.MensagemRepository;
import com.cedro.repository.PasswordResetTokenRepository;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import com.cedro.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SessaoRepository sessaoRepository;

    @Autowired
    private MensagemRepository mensagemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private boolean isBcryptHash(String hash) {
        return hash != null && (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$"));
    }

    private boolean validarSenha(Usuario usuario, String senhaInformada) {
        String senhaHash = usuario.getSenhaHash();
        if (senhaHash == null || senhaHash.isBlank()) {
            return false;
        }

        if (isBcryptHash(senhaHash)) {
            return passwordEncoder.matches(senhaInformada, senhaHash);
        }

        // Compatibilidade com contas antigas salvas em texto puro.
        if (senhaInformada.equals(senhaHash)) {
            usuario.setSenhaHash(passwordEncoder.encode(senhaInformada));
            usuarioRepository.save(usuario);
            return true;
        }

        return false;
    }

    public LoginResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        Usuario usuario = usuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Email ou senha incorretos"));

        if (!validarSenha(usuario, request.getSenha())) {
            throw new RuntimeException("Email ou senha incorretos");
        }

        String token = jwtUtil.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getTipoUsuario().name()
        );

        UsuarioResponse usuarioResponse = new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario(),
                usuario.getTelefone(),
                usuario.getDataNascimento(),
                usuario.getGenero(),
                usuario.getEndereco(),
                usuario.getBio(),
                usuario.getFotoUrl(),
                usuario.getEspecialidade(),
                usuario.getTipoPsicologo(),
                usuario.getCrp(),
                usuario.getAreaInteresse(),
                usuario.getPrecoSessao()
        );

        return new LoginResponse(token, usuarioResponse);
    }

    public void register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Esse email ja ta em uso");
        }

        String senha = request.getSenha();
        if (senha.length() < 6) {
            throw new RuntimeException("Senha muito curta (min. 6 caracteres)");
        }
        if (!senha.matches(".*\\d.*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 numero");
        }
        if (!senha.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 caractere especial");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(request.getSenha()));
        usuario.setDataNascimento(request.getDataNascimento());
        usuario.setGenero(request.getGenero());
        usuario.setTelefone(request.getTelefone());

        // Bloquear registro como admin pela API publica.
        TipoUsuario tipo = request.getTipoUsuario();
        if (tipo == null || tipo == TipoUsuario.admin) {
            usuario.setTipoUsuario(TipoUsuario.paciente);
        } else {
            usuario.setTipoUsuario(tipo);
        }

        if (usuario.getTipoUsuario() == TipoUsuario.psicologo) {
            if (request.getCrp() == null || request.getCrp().isBlank()) {
                throw new RuntimeException("CRP obrigatorio para psicologo");
            }
            if (!request.getCrp().matches("\\d{2}/\\d{5,6}")) {
                throw new RuntimeException("CRP invalido. Use o formato 06/123456");
            }
            if (usuarioRepository.existsByCrp(request.getCrp())) {
                throw new RuntimeException("Este CRP ja esta cadastrado");
            }
            if (request.getEspecialidade() == null || request.getEspecialidade().isBlank()) {
                throw new RuntimeException("Especialidade obrigatoria para psicologo");
            }
            if (request.getTipoPsicologo() == null || request.getTipoPsicologo().isBlank()) {
                throw new RuntimeException("Tipo de psicologo obrigatorio para psicologo");
            }
            if (request.getPrecoSessao() == null || request.getPrecoSessao().signum() <= 0) {
                throw new RuntimeException("Valor da consulta obrigatorio para psicologo");
            }
        }

        if (request.getEspecialidade() != null) {
            usuario.setEspecialidade(request.getEspecialidade());
        }
        if (request.getTipoPsicologo() != null) {
            usuario.setTipoPsicologo(request.getTipoPsicologo());
        }
        if (request.getPrecoSessao() != null) {
            usuario.setPrecoSessao(request.getPrecoSessao());
        }
        if (request.getCrp() != null) {
            usuario.setCrp(request.getCrp());
        }
        if (request.getAreaInteresse() != null) {
            usuario.setAreaInteresse(request.getAreaInteresse());
        }

        usuarioRepository.save(usuario);
    }

    public LoginResponse googleLogin(String email, String nome) {
        String normalizedEmail = normalizeEmail(email);
        Usuario usuario = usuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(normalizedEmail)
                .orElseGet(() -> {
                    Usuario novoUsuario = new Usuario();
                    novoUsuario.setNome(nome);
                    novoUsuario.setEmail(normalizedEmail);
                    novoUsuario.setSenhaHash(passwordEncoder.encode("google_oauth_" + System.currentTimeMillis()));
                    novoUsuario.setTipoUsuario(TipoUsuario.paciente);
                    return usuarioRepository.save(novoUsuario);
                });

        String token = jwtUtil.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getTipoUsuario().name()
        );

        UsuarioResponse usuarioResponse = new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTipoUsuario(),
                usuario.getTelefone(),
                usuario.getDataNascimento(),
                usuario.getGenero(),
                usuario.getEndereco(),
                usuario.getBio(),
                usuario.getFotoUrl(),
                usuario.getEspecialidade(),
                usuario.getTipoPsicologo(),
                usuario.getCrp(),
                usuario.getAreaInteresse(),
                usuario.getPrecoSessao()
        );

        return new LoginResponse(token, usuarioResponse);
    }

    /**
     * Valida o ID token do Google server-side antes de autenticar.
     */
    public LoginResponse googleLoginWithToken(String idToken) {
        try {
            String[] parts = idToken.split("\\.");
            if (parts.length != 3) {
                throw new RuntimeException("Token do Google invalido");
            }

            String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode claims = mapper.readTree(payload);

            String issuer = claims.has("iss") ? claims.get("iss").asText() : "";
            if (!"accounts.google.com".equals(issuer) && !"https://accounts.google.com".equals(issuer)) {
                throw new RuntimeException("Token do Google com issuer invalido");
            }

            long exp = claims.has("exp") ? claims.get("exp").asLong() : 0;
            if (exp * 1000 < System.currentTimeMillis()) {
                throw new RuntimeException("Token do Google expirado");
            }

            String email = claims.has("email") ? claims.get("email").asText() : null;
            String nome = claims.has("name") ? claims.get("name").asText() : null;
            boolean emailVerified = claims.has("email_verified") && claims.get("email_verified").asBoolean();

            if (email == null || email.isEmpty()) {
                throw new RuntimeException("Email nao encontrado no token do Google");
            }

            if (!emailVerified) {
                throw new RuntimeException("Email do Google nao verificado");
            }

            return googleLogin(email, nome != null ? nome : email);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao validar token do Google: " + e.getMessage());
        }
    }

    public void updatePerfil(Integer userId, UpdatePerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (request.getNome() != null) usuario.setNome(request.getNome());
        if (request.getTelefone() != null) usuario.setTelefone(request.getTelefone());
        if (request.getDataNascimento() != null) usuario.setDataNascimento(request.getDataNascimento());
        if (request.getGenero() != null) usuario.setGenero(request.getGenero());
        if (request.getEndereco() != null) usuario.setEndereco(request.getEndereco());
        if (request.getBio() != null) usuario.setBio(request.getBio());
        if (request.getEspecialidade() != null) usuario.setEspecialidade(request.getEspecialidade());
        if (request.getTipoPsicologo() != null) usuario.setTipoPsicologo(request.getTipoPsicologo());
        if (request.getCrp() != null) usuario.setCrp(request.getCrp());
        if (request.getAreaInteresse() != null) usuario.setAreaInteresse(request.getAreaInteresse());
        if (request.getPrecoSessao() != null) usuario.setPrecoSessao(request.getPrecoSessao());

        usuarioRepository.save(usuario);
    }

    public void alterarSenha(Integer userId, AlterarSenhaRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        if (!validarSenha(usuario, request.getSenhaAtual())) {
            throw new RuntimeException("Senha atual ta errada");
        }

        String novaSenha = request.getNovaSenha();
        if (novaSenha.length() < 6) {
            throw new RuntimeException("Senha muito curta (min. 6 caracteres)");
        }
        if (!novaSenha.matches(".*\\d.*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 numero");
        }
        if (!novaSenha.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 caractere especial");
        }

        usuario.setSenhaHash(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluirConta(Integer userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        sessaoRepository.deleteByPacienteId(userId);
        sessaoRepository.deleteByPsicologoId(userId);
        mensagemRepository.deleteByRemetenteId(userId);
        mensagemRepository.deleteByDestinatarioId(userId);
        usuarioRepository.delete(usuario);
    }

    public void recuperarSenha(String email) {
        // Busca silenciosa: nunca revelar se o e-mail existe
        usuarioRepository.findByEmailIgnoreCaseAndAtivoTrue(normalizeEmail(email))
                .ifPresent(usuario -> {
                    String token = UUID.randomUUID().toString().replace("-", "") +
                            UUID.randomUUID().toString().replace("-", "");
                    PasswordResetToken prt = new PasswordResetToken(
                            usuario.getId(), token, LocalDateTime.now().plusMinutes(30));
                    passwordResetTokenRepository.save(prt);
                    emailService.enviarResetSenha(usuario.getEmail(), token);
                });
    }

    @Transactional
    public void redefinirSenha(RedefinirSenhaRequest request) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Token invalido ou expirado"));

        if (prt.isUsado() || prt.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token invalido ou expirado");
        }

        Usuario usuario = usuarioRepository.findById(prt.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        usuario.setSenhaHash(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);

        prt.setUsado(true);
        passwordResetTokenRepository.save(prt);
    }

    public void updateFotoPerfil(Integer userId, String fotoUrl) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        usuario.setFotoUrl(fotoUrl);
        usuarioRepository.save(usuario);
    }
}
