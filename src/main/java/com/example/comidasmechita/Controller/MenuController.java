package com.example.comidasmechita.Controller;

import com.example.comidasmechita.Entity.MenuEntity;
import com.example.comidasmechita.Services.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/menu")
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping
    public List<MenuEntity> getAllMenus() {
        return menuService.getAllMenus();
    }

    @GetMapping("/obtener/{id}")
    public Optional<MenuEntity> getMenuById(@PathVariable Long id) {
        return menuService.getMenuById(id);
    }

    @PostMapping("/crearmenu")
    public MenuEntity createMenu(@RequestBody MenuEntity menu) {
        return menuService.saveMenu( menu);
    }

    @DeleteMapping("/eliminar/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<MenuEntity> updateMenu(@PathVariable Long id, @RequestBody MenuEntity menu) {
        try {
            menu.setId(id);
            MenuEntity updatedMenu = menuService.updateMenu(menu);
            return new ResponseEntity<>(updatedMenu, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
