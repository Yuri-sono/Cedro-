package com.cedro.repository;

import com.cedro.model.entity.Usuario;
import com.cedro.model.TipoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByEmailAndAtivoTrue(String email);
    
    boolean existsByEmail(String email);
    
    List<Usuario> findByTipoUsuarioAndAtivoTrue(TipoUsuario tipoUsuario);
    
    List<Usuario> findByTipoUsuarioAndAtivo(TipoUsuario tipoUsuario, boolean ativo);
    
    List<Usuario> findByAtivoTrue();
}