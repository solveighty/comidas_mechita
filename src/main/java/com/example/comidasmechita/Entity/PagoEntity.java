package com.example.comidasmechita.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "pagos")

public class PagoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(name = "carrito_id", referencedColumnName = "id")
    private CarritoEntity carrito;

    private double total;

    @Enumerated(EnumType.STRING) // Usamos EnumType.STRING para que se almacene como String en la base de datos
    private MetodoPago metodoPago;

    private LocalDateTime fechaPago;

    private String stripePaymentIntentId; // Stripe Payment Intent ID
    private String stripePaymentStatus; // Payment status (e.g., "succeeded", "failed")

    @Getter
    public enum MetodoPago {
        TARJETA("Tarjeta"),
        PAYPAL("PayPal"),
        TRANSFERENCIA_BANCARIA("Transferencia Bancaria"),
        EFECTIVO("Efectivo");

        private final String descripcion;

        MetodoPago(String descripcion) {
            this.descripcion = descripcion;
        }

    }
}
