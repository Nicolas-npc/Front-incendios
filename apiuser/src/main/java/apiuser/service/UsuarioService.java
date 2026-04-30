package apiuser.service;

import java.util.List;

import org.springframework.stereotype.Service;

import apiuser.model.Usuario;
import apiuser.repository.UsuarioRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UsuarioService {

    private final UsuarioRepository repositorio;

    public List<Usuario> MostrarUsuario(){
        return repositorio.findAll();
    }

    public String GuardarUsuarios(Usuario usuario){
        repositorio.save(usuario);

        return "se guardo el usuario con id: " + usuario.getId();
    }


    public String IniciarSesion(Usuario usuario){
        return repositorio.findByCorreo(usuario.getCorreo()).map(
            usuarioDb -> {
                if(usuarioDb.getPassword().equals(usuario.getPassword())){
                    return "Inicio de Sesion correcto";
                }else{
                    return "Credenciales Incorrectas";
                }
            }).orElse("Credenciales Incorrectas");
    }


}
