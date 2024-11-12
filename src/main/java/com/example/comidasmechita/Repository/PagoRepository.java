package com.example.comidasmechita.Repository;

import com.example.comidasmechita.Entity.PagoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagoRepository extends JpaRepository<PagoEntity, Long> {
    List<PagoEntity> findByUsuarioId(Long usuarioId);
}
