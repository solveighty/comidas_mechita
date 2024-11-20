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
    private NotificacionService notificacionService;


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
}

