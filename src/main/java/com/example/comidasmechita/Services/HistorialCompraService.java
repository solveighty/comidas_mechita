package com.example.comidasmechita.Services;

import com.example.comidasmechita.Entity.CarritoEntity;
import com.example.comidasmechita.Entity.DetalleCompraEntity;
import com.example.comidasmechita.Entity.HistorialCompraEntity;
import com.example.comidasmechita.Repository.HistorialCompraRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistorialCompraService {
    @Autowired
    private HistorialCompraRepository historialCompraRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Transactional
    public void registrarCompra(CarritoEntity carrito) {
        // Crear un nuevo historial de compra
        HistorialCompraEntity historialCompra = new HistorialCompraEntity();
        historialCompra.setUsuario(carrito.getUsuario());
        historialCompra.setFechaCompra(LocalDateTime.now());

        // Convertir ítems del carrito en detalles de compra
        List<DetalleCompraEntity> detalles = carrito.getItems().stream().map(item -> {
            DetalleCompraEntity detalle = new DetalleCompraEntity();
            detalle.setNombreMenu(item.getMenu().getNombre());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecio(item.getMenu().getPrecio() * item.getCantidad());
            return detalle;
        }).collect(Collectors.toList());

        historialCompra.setDetalles(detalles);

        // Guardar el historial de compra
        historialCompraRepository.save(historialCompra);
    }

    // Nuevo método para buscar el historial por usuario
    public List<HistorialCompraEntity> findByUsuarioId(Long usuarioId) {
        return historialCompraRepository.findByUsuarioId(usuarioId);
    }

    public List<HistorialCompraEntity> getAllHistorialIfAdmin(Long userId) {
        if (usuarioService.isAdmin(userId)) {
            return historialCompraRepository.findAll();
        } else {
            throw new RuntimeException("Acceso denegado. Solo los administradores pueden ver el historial completo.");
        }
    }

    @Transactional
    public HistorialCompraEntity actualizarEstadoCompra(Long userId, Long historialId, HistorialCompraEntity.EstadoCompra nuevoEstado) {
        if (!usuarioService.isAdmin(userId)) {
            throw new RuntimeException("Acceso denegado. Solo los administradores pueden cambiar el estado de una compra.");
        }

        HistorialCompraEntity historialCompra = historialCompraRepository.findById(historialId)
                .orElseThrow(() -> new RuntimeException("Historial de compra no encontrado"));

        historialCompra.setEstadoCompra(nuevoEstado);
        return historialCompraRepository.save(historialCompra);
    }
}
