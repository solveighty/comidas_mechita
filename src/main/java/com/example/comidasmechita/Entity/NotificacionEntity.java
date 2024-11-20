package com.example.comidasmechita.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "notificaciones")
public class NotificacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private UsuarioEntity usuario;  // El usuario que recibe la notificación

    private String mensaje;

    private boolean leida = false;

    private LocalDateTime fecha = LocalDateTime.now();

    @Enumerated(EnumType.STRING)  // Usar EnumType.STRING para almacenar el valor como cadena
    private TipoNotificacion tipoNotificacion;  // Usamos el enum

    public enum TipoNotificacion {
        USUARIO,
        ADMINISTRADOR
    }
}
