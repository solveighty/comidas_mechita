package com.example.comidasmechita.Services;

import com.example.comidasmechita.Entity.CarritoEntity;
import com.example.comidasmechita.Entity.UsuarioEntity;
import com.example.comidasmechita.Repository.CarritoRepository;
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

            // Inicializar el carrito si no está presente
            if (usuario.getCarrito() == null) {
                // Crear un nuevo carrito si no existe
                CarritoEntity carrito = new CarritoEntity();
                carrito.setUsuario(usuario); // Establecer la relación inversa con el usuario
                usuario.setCarrito(carrito); // Asocia el carrito al usuario
            }

            // Guardar el usuario (con el carrito automáticamente si hay cascada configurada)
            return usuarioRepository.save(usuario);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el usuario", e);
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
            updatedUsuario.setNombre(usuario.getNombre());

            try {
                // Only hash the password if it's different from the current hash
                if (!updatedUsuario.getContrasena().equals(usuario.getContrasena())) {
                    String encodedPassword = PasswordEncoder.encode(usuario.getContrasena());
                    updatedUsuario.setContrasena(encodedPassword);
                }
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
