package com.cedro.config;

import com.cedro.model.TipoUsuario;
import com.cedro.model.entity.Usuario;
import com.cedro.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

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
        createPsychologistDemo();
        createPatientDemo();
    }

    private void createPsychologistDemo() {
        String email = "psicologo.demo@cedro.app";

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        Usuario psicologo = new Usuario();
        psicologo.setNome("Dra. Marina Almeida");
        psicologo.setEmail(email);
        psicologo.setSenhaHash(passwordEncoder.encode("Cedro@123"));
        psicologo.setTipoUsuario(TipoUsuario.psicologo);
        psicologo.setTelefone("(11) 99999-0000");
        psicologo.setEspecialidade("Terapia Cognitivo-Comportamental");
        psicologo.setTipoPsicologo("Terapia Cognitivo-Comportamental");
        psicologo.setCrp("06/123456");
        psicologo.setPrecoSessao(BigDecimal.valueOf(180));
        psicologo.setBio("Psicologa de demonstracao para apresentacao do TCC. Atendimento acolhedor e objetivo.");
        psicologo.setAtivo(true);

        usuarioRepository.save(psicologo);
        System.out.println("[Cedro] Usuario psicologo demo criado: " + email);
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
        paciente.setBio("Conta paciente de demonstracao para exibir chat e chamadas.");
        paciente.setAtivo(true);

        usuarioRepository.save(paciente);
        System.out.println("[Cedro] Usuario paciente demo criado: " + email);
    }
}
