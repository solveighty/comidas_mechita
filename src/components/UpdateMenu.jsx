import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function UpdateMenu({ userId, toast, onClose }) {
    const [menus, setMenus] = useState([]); // Lista de menús
    const [selectedMenu, setSelectedMenu] = useState(null); // Menú seleccionado
    const [menuData, setMenuData] = useState({
        nombre: '',
        descripcion: '',
        precio: null,
        imagen: '',
        categoria: '',
    });

    const categorias = [
        { label: 'Platos Especiales', value: 'PLATOS_ESPECIALES' },
        { label: 'Comidas Rápidas', value: 'COMIDAS_RAPIDAS' },
        { label: 'Bocaditos', value: 'BOCADITOS' },
    ];

    // Cargar los menús desde el backend
    useEffect(() => {
        fetch('http://localhost:8080/menu')
            .then((response) => response.json())
            .then((data) => setMenus(data))
            .catch(() => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los menús.',
                    life: 3000,
                });
            });
    }, []);

    // Manejar selección de menú
    const handleMenuSelect = (menuId) => {
        const selected = menus.find((menu) => menu.id === menuId);
        if (selected) {
            setSelectedMenu(selected.id);
            setMenuData({
                nombre: selected.nombre,
                descripcion: selected.descripcion,
                precio: selected.precio,
                imagen: selected.imagen,
                categoria: selected.categoria,
            });
        }
    };

    // Manejar cambios en los campos del formulario
    const handleChange = (e, field) => {
        const value = e.target ? e.target.value : e.value;
        setMenuData({ ...menuData, [field]: value });
    };

    // Manejar la actualización del menú
    const handleUpdate = () => {
        if (!selectedMenu) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, selecciona un menú para actualizar.',
                life: 3000,
            });
            return;
        }

        fetch(`http://localhost:8080/menu/editar/${selectedMenu}?userId=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuData),
        })
            .then((response) => {
                if (response.ok) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `El menú con ID ${selectedMenu} fue actualizado correctamente.`,
                        life: 3000,
                    });
                    onClose(); // Cerrar el diálogo
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `No se pudo actualizar el menú con ID ${selectedMenu}.`,
                        life: 3000,
                    });
                }
            })
            .catch(() => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un problema al intentar actualizar el menú.',
                    life: 3000,
                });
            });
    };

    return (
        <div>
            <div className="p-field">
                <label htmlFor="menu" className="p-mb-2">Seleccionar Menú</label>
                <Dropdown
                    id="menu"
                    value={selectedMenu}
                    options={menus.map((menu) => ({ label: menu.nombre, value: menu.id }))}
                    onChange={(e) => handleMenuSelect(e.value)}
                    placeholder="Selecciona un menú"
                    className="p-mb-3"
                />
            </div>

            {selectedMenu && (
                <>
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={menuData.nombre}
                            onChange={(e) => handleChange(e, 'nombre')}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="descripcion">Descripción</label>
                        <InputText
                            id="descripcion"
                            value={menuData.descripcion}
                            onChange={(e) => handleChange(e, 'descripcion')}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="precio">Precio</label>
                        <InputNumber
                            id="precio"
                            value={menuData.precio}
                            onValueChange={(e) => handleChange(e, 'precio')}
                            mode="currency"
                            currency="USD"
                            locale="es-US"
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="imagen">Imagen URL</label>
                        <InputText
                            id="imagen"
                            value={menuData.imagen}
                            onChange={(e) => handleChange(e, 'imagen')}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="categoria">Categoría</label>
                        <Dropdown
                            id="categoria"
                            value={menuData.categoria}
                            options={categorias}
                            onChange={(e) => handleChange(e, 'categoria')}
                            placeholder="Selecciona una categoría"
                        />
                    </div>
                    <Button label="Actualizar" icon="pi pi-check" onClick={handleUpdate} className="p-button-success p-mt-3" />
                </>
            )}
            <Button label="Cerrar" icon="pi pi-times" onClick={onClose} className="p-button-secondary p-mt-3" />
        </div>
    );
}
