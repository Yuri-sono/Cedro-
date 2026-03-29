package com.cedro.service;

import com.cedro.model.dto.*;
import com.cedro.model.TipoUsuario;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.MensagemRepository;
import com.cedro.repository.SessaoRepository;
import com.cedro.repository.UsuarioRepository;
import com.cedro.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


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
    
    public LoginResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha incorretos"));
        
        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenhaHash())) {
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
                usuario.getPrecoSessao()
        );
        
        return new LoginResponse(token, usuarioResponse);
    }
    
    public void register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Esse email já tá em uso");
        }
        
        String senha = request.getSenha();
        if (senha.length() < 6) {
            throw new RuntimeException("Senha muito curta (mín. 6 caracteres)");
        }
        if (!senha.matches(".*\\d.*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 número");
        }
        if (!senha.matches(".*[!@#$%^&*(),.?\":{}|<>].*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 caractere especial");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenhaHash(passwordEncoder.encode(request.getSenha()));
        usuario.setDataNascimento(request.getDataNascimento());
        usuario.setGenero(request.getGenero());
        usuario.setTelefone(request.getTelefone());
        usuario.setTipoUsuario(request.getTipoUsuario());
        
        if (request.getEspecialidade() != null) {
            usuario.setEspecialidade(request.getEspecialidade());
        }
        if (request.getPrecoSessao() != null) {
            usuario.setPrecoSessao(request.getPrecoSessao());
        }
        
        usuarioRepository.save(usuario);
    }
    
    public LoginResponse googleLogin(String email, String nome) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(email)
                .orElseGet(() -> {
                    Usuario novoUsuario = new Usuario();
                    novoUsuario.setNome(nome);
                    novoUsuario.setEmail(email);
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
                usuario.getPrecoSessao()
        );
        
        return new LoginResponse(token, usuarioResponse);
    }
    
    public void updatePerfil(Integer userId, UpdatePerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (request.getNome() != null) usuario.setNome(request.getNome());
        if (request.getTelefone() != null) usuario.setTelefone(request.getTelefone());
        if (request.getDataNascimento() != null) usuario.setDataNascimento(request.getDataNascimento());
        if (request.getGenero() != null) usuario.setGenero(request.getGenero());
        if (request.getEndereco() != null) usuario.setEndereco(request.getEndereco());
        if (request.getBio() != null) usuario.setBio(request.getBio());
        if (request.getEspecialidade() != null) usuario.setEspecialidade(request.getEspecialidade());
        if (request.getPrecoSessao() != null) usuario.setPrecoSessao(request.getPrecoSessao());
        
        usuarioRepository.save(usuario);
    }
    
    public void alterarSenha(Integer userId, AlterarSenhaRequest request) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getSenhaHash())) {
            throw new RuntimeException("Senha atual tá errada");
        }
        
        String novaSenha = request.getNovaSenha();
        if (novaSenha.length() < 6) {
            throw new RuntimeException("Senha muito curta (mín. 6 caracteres)");
        }
        if (!novaSenha.matches(".*\\d.*")) {
            throw new RuntimeException("Precisa ter pelo menos 1 número");
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
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        sessaoRepository.deleteByPacienteId(userId);
        sessaoRepository.deleteByPsicologoId(userId);
        mensagemRepository.deleteByRemetenteId(userId);
        mensagemRepository.deleteByDestinatarioId(userId);
        usuarioRepository.delete(usuario);
    }
    
    public void recuperarSenha(String email) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Email não cadastrado"));
        String senhaTemporaria = "Temp@" + System.currentTimeMillis() % 10000;
        usuario.setSenhaHash(passwordEncoder.encode(senhaTemporaria));
        usuarioRepository.save(usuario);
        // TODO: integrar envio de email (ex: SendGrid, JavaMailSender)
        // Por ora a senha temporaria e gerada mas nao entregue automaticamente
    }
    
    public void updateFotoPerfil(Integer userId, String fotoUrl) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setFotoUrl(fotoUrl);
        usuarioRepository.save(usuario);
    }
}
