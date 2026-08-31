package com.cedro.config;

import com.cedro.model.TipoUsuario;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DemoPsychologistSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoPsychologistSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        createPatientDemo();
        createAdminDemo();
    }

    private void createPatientDemo() {
        String email = "paciente.demo@cedro.app";

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        Usuario paciente = new Usuario();
        paciente.setNome("Lucas Ferreira");
        paciente.setEmail(email);
        paciente.setSenhaHash(passwordEncoder.encode("Cedro@123"));
        paciente.setTipoUsuario(TipoUsuario.paciente);
        paciente.setTelefone("(11) 98888-0000");
        paciente.setAreaInteresse("Terapia Cognitivo-Comportamental");
        paciente.setBio("Conta paciente de demonstracao para exibir chat e reunioes via Google Meet.");
        paciente.setAtivo(true);

        usuarioRepository.save(paciente);
        System.out.println("[Cedro] Usuario paciente demo criado: " + email);
    }
private void createAdminDemo() {
        String email = "admin@cedro.app";

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setNome("Administrador Cedro");
        admin.setEmail(email);
        admin.setSenhaHash(passwordEncoder.encode("Admin@2026"));
        admin.setTipoUsuario(TipoUsuario.admin);
        admin.setBio("Administrador da plataforma Cedro.");
        admin.setAtivo(true);

        usuarioRepository.save(admin);
        System.out.println("[Cedro] Usuario admin demo criado: " + email);
    }
}
