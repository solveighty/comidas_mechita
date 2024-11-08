package com.example.comidasmechita.Controller;

import com.example.comidasmechita.Entity.UsuarioEntity;
import com.example.comidasmechita.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<List<UsuarioEntity>> getAllUsuarios() {
        List<UsuarioEntity> usuarios = usuarioService.getAllUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    // Obtener un usuario por su ID
    @GetMapping("/obtenerusuario/{id}")
    public ResponseEntity<UsuarioEntity> getUsuarioById(@PathVariable Long id) {
        Optional<UsuarioEntity> usuario = usuarioService.getUsuarioById(id);
        return usuario.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Crear un nuevo usuario
    @PostMapping("/crearusuario")
    public ResponseEntity<UsuarioEntity> createUsuario(@RequestBody UsuarioEntity usuario) {
        UsuarioEntity createdUsuario = usuarioService.saveUsuario(usuario);
        return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
    }

    // Actualizar un usuario por su ID
    @PutMapping("/editarusuario/{id}")
    public ResponseEntity<UsuarioEntity> updateUsuario(@PathVariable Long id, @RequestBody UsuarioEntity usuario) {
        try {
            UsuarioEntity updatedUsuario = usuarioService.updateUsuario(id, usuario);
            return new ResponseEntity<>(updatedUsuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar un usuario por su ID
    @DeleteMapping("/eliminarusuario/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        try {
            usuarioService.deleteUsuario(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
