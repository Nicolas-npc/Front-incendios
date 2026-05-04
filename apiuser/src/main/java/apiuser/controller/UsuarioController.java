package apiuser.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import apiuser.dto.LoginDTO;
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
    public List<Usuario> MostrarUsuario() {
        return service.MostrarUsuario();
    }

    @PostMapping("/guardar")
    public String GuardarUsuarios(@Valid @RequestBody Usuario usuario) {
        return service.GuardarUsuarios(usuario);
    }

    @PostMapping("/login")
    public String IniciarSesion(@RequestBody LoginDTO usuario) {
        return service.IniciarSesion(usuario);
    }

    @DeleteMapping("/borrar/{id}")
    public String borrarUsuario(@PathVariable Long id) {
        return service.borrarUsuario(id);
    }
}