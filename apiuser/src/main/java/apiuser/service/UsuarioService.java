package apiuser.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import apiuser.dto.LoginDTO;
import apiuser.model.Usuario;
import apiuser.repository.UsuarioRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repositorio;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Usuario> MostrarUsuario() {
        return repositorio.findAll();
    }

    public String GuardarUsuarios(Usuario usuario) {
        if (repositorio.findByCorreo(usuario.getCorreo()).isPresent()) {
            return "ya existe el usuario con correo: " + usuario.getCorreo();
        } else {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            repositorio.save(usuario);
            return "se guardo el usuario con id: " + usuario.getId();
        }
    }

    public String IniciarSesion(LoginDTO usuario) {
        return repositorio.findByCorreo(usuario.getCorreo()).map(
            usuarioDb -> {
                if (passwordEncoder.matches(usuario.getPassword(), usuarioDb.getPassword())) {
                    return "Inicio de Sesion correcto";
                } else {
                    return "Credenciales Incorrectas";
                }
            }).orElse("Credenciales Incorrectas");
    }

    public String borrarUsuario(Long id) {
        if (repositorio.findById(id).isPresent()) {
            repositorio.deleteById(id);
            return "usuario eliminado con id: " + id;
        } else {
            return "no existe ningún usuario con ese id";
        }
    }
}