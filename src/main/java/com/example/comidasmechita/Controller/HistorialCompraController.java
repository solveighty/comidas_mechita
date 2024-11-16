package com.example.comidasmechita.Controller;

import com.example.comidasmechita.Entity.HistorialCompraEntity;
import com.example.comidasmechita.Services.HistorialCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
