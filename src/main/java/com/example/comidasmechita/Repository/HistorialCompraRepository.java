package com.example.comidasmechita.Repository;

import com.example.comidasmechita.Entity.HistorialCompraEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialCompraRepository extends JpaRepository<HistorialCompraEntity, Long> {
    List<HistorialCompraEntity> findByUsuarioId(Long usuarioId);
}
