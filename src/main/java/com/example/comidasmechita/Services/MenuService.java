package com.example.comidasmechita.Services;

import com.example.comidasmechita.Entity.MenuEntity;
import com.example.comidasmechita.Repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {
    @Autowired
    private MenuRepository menuRepository;

    public List<MenuEntity> getAllMenus() {
        return menuRepository.findAll();
    }

    public Optional<MenuEntity> getMenuById(Long menuId) {
        return menuRepository.findById(menuId);
    }

    public MenuEntity saveMenu(MenuEntity menu) {
        return menuRepository.save(menu);
    }

    public void deleteMenu(MenuEntity menu) {
        menuRepository.delete(menu);
    }

    public MenuEntity updateMenu(MenuEntity menu) {
        Optional<MenuEntity> existingMenu = menuRepository.findById(menu.getId());

        if (existingMenu.isPresent()) {
            MenuEntity updatedMenu = existingMenu.get();
            updatedMenu.setNombre(menu.getNombre());
            updatedMenu.setDescripcion(menu.getDescripcion());
            updatedMenu.setPrecio(menu.getPrecio());
            updatedMenu.setImagen(menu.getImagen());
            return menuRepository.save(updatedMenu);
        } else {
            throw new RuntimeException("No se ha encontrado el Menú con ID: " + menu.getId());
        }
    }
}
