package com.example.comidasmechita.Controller;

import com.example.comidasmechita.Entity.HistorialCompraEntity;
import com.example.comidasmechita.Services.HistorialCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/historial")
public class HistorialCompraController {
    @Autowired
    private HistorialCompraService historialCompraService;

    @GetMapping("/{usuarioId}")
    public ResponseEntity<List<HistorialCompraEntity>> getHistorialByUsuarioId(@PathVariable Long usuarioId) {
        List<HistorialCompraEntity> historial = historialCompraService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/all")
    public ResponseEntity<List<HistorialCompraEntity>> getAllHistorial(@RequestParam Long userId) {
        try {
            List<HistorialCompraEntity> historial = historialCompraService.getAllHistorialIfAdmin(userId);
            return ResponseEntity.ok(historial);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).build(); // Retorna 403 si no tiene permisos
        }
    }

    @PutMapping("/actualizar-estado/{historialId}")
    public ResponseEntity<HistorialCompraEntity> actualizarEstadoCompra(
            @RequestParam Long userId,
            @PathVariable Long historialId,
            @RequestParam HistorialCompraEntity.EstadoCompra nuevoEstado) {
        try {
            HistorialCompraEntity actualizado = historialCompraService.actualizarEstadoCompra(userId, historialId, nuevoEstado);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(null); // Acceso denegado
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // Error interno
        }
    }
}
