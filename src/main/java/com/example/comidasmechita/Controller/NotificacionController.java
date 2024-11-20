package com.example.comidasmechita.Controller;

import com.example.comidasmechita.Entity.HistorialCompraEntity;
import com.example.comidasmechita.Services.HistorialCompraService;
import com.example.comidasmechita.Services.NotificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notificaciones")
public class NotificacionController {
    @Autowired
    private HistorialCompraService historialCompraService;

    @Autowired
    private NotificacionService notificacionService;

    // Endpoint para cambiar el estado de una compra y notificar al usuario
    @PutMapping("/cambiar-estado/{historialCompraId}")
    public ResponseEntity<Void> cambiarEstadoCompra(@PathVariable Long historialCompraId,
                                                    @RequestParam HistorialCompraEntity.EstadoCompra nuevoEstado) {
        // Cambiar el estado de la compra y notificar al usuario
        historialCompraService.cambiarEstadoCompra(historialCompraId, nuevoEstado);
        return ResponseEntity.noContent().build();  // Retorna 204 No Content si la operación fue exitosa
    }

    // Endpoint para obtener las notificaciones no leídas de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerNotificacionesNoLeidas(@PathVariable Long usuarioId) {
        // Suponiendo que tienes un método en el servicio para obtener las notificaciones no leídas del usuario
        var notificaciones = notificacionService.obtenerNotificacionesNoLeidas(usuarioId);
        return ResponseEntity.ok(notificaciones);
    }

    // Endpoint para marcar una notificación como leída
    @PutMapping("/marcar-leida/{notificacionId}")
    public ResponseEntity<Void> marcarNotificacionLeida(@PathVariable Long notificacionId) {
        // Marcar la notificación como leída
        notificacionService.marcarNotificacionLeida(notificacionId);
        return ResponseEntity.noContent().build();  // Retorna 204 No Content si la operación fue exitosa
    }

    @PutMapping("/historialcompra/{id}/estado")
    public ResponseEntity<Void> cambiarEstadoPedido(@PathVariable Long id, @RequestBody HistorialCompraEntity.EstadoCompra nuevoEstado) {
        historialCompraService.cambiarEstadoCompra(id, nuevoEstado);
        return ResponseEntity.ok().build();  // Retorna 200 OK si todo fue exitoso
    }


}

