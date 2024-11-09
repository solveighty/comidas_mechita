package com.example.comidasmechita.Services;

import com.example.comidasmechita.Entity.CarritoEntity;
import com.example.comidasmechita.Entity.CarritoItemEntity;
import com.example.comidasmechita.Entity.MenuEntity;
import com.example.comidasmechita.Entity.UsuarioEntity;
import com.example.comidasmechita.Repository.CarritoItemRepository;
import com.example.comidasmechita.Repository.CarritoRepository;
import com.example.comidasmechita.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarritoService {
    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private CarritoItemRepository carritoItemRepository;

    @Autowired
    private MenuService menuService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public CarritoEntity getOrCreateCarrito(Long usuarioId) {
        UsuarioEntity usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return carritoRepository.findByUsuario(usuario)
                .orElseGet(() -> {
                    CarritoEntity newCarrito = new CarritoEntity();
                    newCarrito.setUsuario(usuario);
                    return carritoRepository.save(newCarrito);
                });
    }

    public CarritoEntity addItemToCarrito(Long usuarioId, Long menuId, int cantidad) {
        // Obtén el carrito del usuario o créalo si no existe
        CarritoEntity carrito = getOrCreateCarrito(usuarioId);
        MenuEntity menu = menuService.getMenuById(menuId)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado"));

        // Crear el nuevo item del carrito
        CarritoItemEntity item = new CarritoItemEntity();
        item.setCarrito(carrito);  // Asocia el ítem con el carrito
        item.setMenu(menu);        // Asocia el ítem con el menú
        item.setCantidad(cantidad);  // Establece la cantidad del ítem

        // Agregar el item al carrito
        carrito.getItems().add(item);  // Agrega el ítem al carrito

        // Guardar el item y el carrito en la base de datos
        carritoItemRepository.save(item);
        carrito = carritoRepository.save(carrito);  // Guarda el carrito actualizado

        // Actualizar la relación en el usuario (si no se ha actualizado)
        UsuarioEntity usuario = carrito.getUsuario();
        if (usuario != null) {
            usuario.setCarrito(carrito);  // Asegura que el carrito esté asociado al usuario
            usuarioRepository.save(usuario);  // Guarda el usuario para actualizar la relación
        }

        return carrito;  // Devuelve el carrito actualizado
    }



    public CarritoEntity updateItemCantidad(Long carritoItemId, int cantidad) {
        CarritoItemEntity item = carritoItemRepository.findById(carritoItemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        item.setCantidad(cantidad);
        carritoItemRepository.save(item);
        return item.getCarrito();
    }

    public void eliminarCarrito(Long carritoId) {
        CarritoEntity carrito = carritoRepository.findById(carritoId)
                .orElseThrow(() -> new RuntimeException("Carrito no encontrado"));

        // Elimina el carrito de la relación en UsuarioEntity
        UsuarioEntity usuario = carrito.getUsuario();
        if (usuario != null) {
            usuario.setCarrito(null); // Elimina la referencia del carrito
            usuarioRepository.save(usuario); // Guarda los cambios en el usuario
        }

        // Elimina los items del carrito antes de eliminar el carrito
        carritoItemRepository.deleteAll(carrito.getItems());

        // Finalmente, elimina el carrito de la base de datos
        carritoRepository.delete(carrito);
    }
}
