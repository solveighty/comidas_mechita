package com.example.comidasmechita.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    private String nombre;
    private String contrasena;
    private String telefono;
    private String email;
    private String direccion;


    @OneToOne(mappedBy = "usuario")  // Relación bidireccional con CarritoEntity
    @JsonManagedReference  // Indica que se debe serializar el carrito del usuario
    private CarritoEntity carrito;


    @Enumerated(EnumType.STRING)
    private Rol rol;


    public enum Rol{
        ADMIN,
        NORMAL
    }

}
