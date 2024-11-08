package com.example.comidasmechita.Services;

import com.example.comidasmechita.Entity.UsuarioEntity;
import com.example.comidasmechita.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioEntity> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<UsuarioEntity> getUsuarioById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<UsuarioEntity> getUsuarioByUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario);
    }

    public UsuarioEntity saveUsuario(UsuarioEntity usuario) {
        return usuarioRepository.save(usuario);
    }

    public void deleteUsuario(Long id) {
        Optional<UsuarioEntity> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            usuarioRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }


    public UsuarioEntity updateUsuario(Long id, UsuarioEntity usuario) {
        Optional<UsuarioEntity> existingUsuario = usuarioRepository.findById(id);

        if (existingUsuario.isPresent()) {
            UsuarioEntity updatedUsuario = existingUsuario.get();
            updatedUsuario.setUsuario(usuario.getUsuario());
            updatedUsuario.setContrasena(usuario.getContrasena());
            updatedUsuario.setRol(usuario.getRol());
            return usuarioRepository.save(updatedUsuario);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }
}
