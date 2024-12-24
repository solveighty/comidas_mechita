import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import url_Backend from './config';

export default function DeleteMenu({ userId, toast, onClose }) {
    const [menus, setMenus] = useState([]); // Estado para almacenar los menús

    // Cargar los menús desde el backend
    useEffect(() => {
        fetch(`http://${url_Backend}:8080/menu`)
            .then((response) => response.json())
            .then((data) => setMenus(data))
            .catch((error) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los menús.',
                    life: 3000,
                });
            });
    }, []);

    // Manejar la eliminación de un menú
    const handleDelete = (menuId) => {
        fetch(`http://${url_Backend}:8080/menu/eliminar/${menuId}?userId=${userId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `El menú con ID ${menuId} fue eliminado correctamente.`,
                        life: 3000,
                    });

                    // Actualizar la lista de menús después de eliminar
                    setMenus(menus.filter((menu) => menu.id !== menuId));
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `No se pudo eliminar el menú con ID ${menuId}.`,
                        life: 3000,
                    });
                }
            })
            .catch((error) => {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un problema al intentar eliminar el menú.',
                    life: 3000,
                });
            });
    };

    // Renderizar el botón de eliminar
    const deleteButtonTemplate = (rowData) => {
        return (
            <Button
                label="Eliminar"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => handleDelete(rowData.id)}
            />
        );
    };

    return (
        <div>
            <DataTable value={menus} responsiveLayout="scroll">
                <Column field="id" header="ID" />
                <Column field="nombre" header="Nombre" />
                <Column field="precio" header="Precio" />
                <Column field="categoria" header="Categoría" />
                <Column body={deleteButtonTemplate} header="Acciones" />
            </DataTable>
            <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={onClose}
            />
        </div>
    );
}
