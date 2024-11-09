package com.example.comidasmechita.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "usuarios")
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuario;
    private String contrasena;
    private String telefono;
    private String email;
    private String direccion;

    @Enumerated(EnumType.STRING)
    private Rol rol;


    public enum Rol{
        ADMIN,
        NORMAL
    }

}
