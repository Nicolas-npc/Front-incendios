package apiuser.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import apiuser.model.Usuario;
import apiuser.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/apiuser")
@AllArgsConstructor
public class UsuarioController {

    private final UsuarioService service;

    @GetMapping("/usuarios")
    public List<Usuario> MostrarUsuario(){
        return service.MostrarUsuario();
    }

    @PostMapping("/guardar")
    public String GuardarUsuarios(@Valid @RequestBody Usuario usuario){
        return service.GuardarUsuarios(usuario);
    }

    @PostMapping("/login")
    public String IniciarSesion(@RequestBody Usuario usuario){
        return service.IniciarSesion(usuario);
    }
}
