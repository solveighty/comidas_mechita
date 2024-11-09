package com.example.comidasmechita.Services;

import com.example.comidasmechita.Entity.UsuarioEntity;
import com.example.comidasmechita.Repository.UsuarioRepository;
import com.example.comidasmechita.Security.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import java.security.NoSuchAlgorithmException;
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
        try {
            // Encriptar la contraseña antes de guardarla
            String encodedPassword = PasswordEncoder.encode(usuario.getContrasena());
            usuario.setContrasena(encodedPassword);
            return usuarioRepository.save(usuario);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al encriptar la contraseña", e);
        }
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
            try {
                // Encriptar la contraseña antes de actualizarla
                String encodedPassword = PasswordEncoder.encode(usuario.getContrasena());
                updatedUsuario.setContrasena(encodedPassword);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException("Error al encriptar la contraseña", e);
            }
            updatedUsuario.setRol(usuario.getRol());
            updatedUsuario.setEmail(usuario.getEmail());
            updatedUsuario.setTelefono(usuario.getTelefono());
            updatedUsuario.setDireccion(usuario.getDireccion());
            return usuarioRepository.save(updatedUsuario);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }

    public boolean isAdmin(Long userId) {
        return usuarioRepository.findById(userId)
                .map(usuario -> usuario.getRol() == UsuarioEntity.Rol.ADMIN)
                .orElse(false);
    }

    public boolean checkPassword(String enteredPassword, String storedHash) throws NoSuchAlgorithmException {
        // Compara el hash de la contraseña ingresada con el hash almacenado
        String enteredPasswordHash = PasswordEncoder.encode(enteredPassword);
        return enteredPasswordHash.equals(storedHash);
    }
}
