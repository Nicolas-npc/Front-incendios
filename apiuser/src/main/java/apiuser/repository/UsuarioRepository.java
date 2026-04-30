package apiuser.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import apiuser.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Optional<Usuario> findByCorreo(String correo);

    Optional<Usuario> findByPassword(String password);
}
