import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const navigate = useNavigate();
    
    // Estado para controlar la visibilidad de los diálogos
    const [displayAddDialog, setDisplayAddDialog] = useState(false);
    const [displayUpdateDialog, setDisplayUpdateDialog] = useState(false);
    const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
    const [displayOrdersDialog, setDisplayOrdersDialog] = useState(false);
    
    // Estado para los datos de los formularios
    const [menuName, setMenuName] = useState('');
    const [menuDescription, setMenuDescription] = useState('');

    // Funciones para abrir los diálogos
    const openAddDialog = () => setDisplayAddDialog(true);
    const openUpdateDialog = () => setDisplayUpdateDialog(true);
    const openDeleteDialog = () => setDisplayDeleteDialog(true);
    const openOrdersDialog = () => setDisplayOrdersDialog(true);

    // Funciones para cerrar los diálogos
    const closeDialog = () => {
        setDisplayAddDialog(false);
        setDisplayUpdateDialog(false);
        setDisplayDeleteDialog(false);
        setDisplayOrdersDialog(false);
    };

    // Función para manejar la acción de agregar un menú
    const handleAddMenu = () => {
        console.log('Agregar menú', menuName, menuDescription);
        // Aquí deberías agregar la lógica para agregar un nuevo menú
        closeDialog();
    };

    // Función para manejar la acción de actualizar un menú
    const handleUpdateMenu = () => {
        console.log('Actualizar menú', menuName, menuDescription);
        // Aquí deberías agregar la lógica para actualizar el menú
        closeDialog();
    };

    // Función para manejar la acción de eliminar un menú
    const handleDeleteMenu = () => {
        console.log('Eliminar menú');
        // Aquí deberías agregar la lógica para eliminar el menú
        closeDialog();
    };

    return (
        <div className="admin-container">
            <h2>Panel de Administración</h2>

            <div className="admin-buttons">
                <Button label="Agregar Menú" icon="pi pi-plus" onClick={openAddDialog} className="p-button-success" />
                <Button label="Actualizar Menú" icon="pi pi-pencil" onClick={openUpdateDialog} className="p-button-warning" />
                <Button label="Eliminar Menú" icon="pi pi-trash" onClick={openDeleteDialog} className="p-button-danger" />
                <Button label="Ver Pedidos" icon="pi pi-list" onClick={openOrdersDialog} className="p-button-info" />
            </div>

            {/* Dialogo para agregar menú */}
            <Dialog header="Agregar Menú" visible={displayAddDialog} onHide={closeDialog}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="menuName">Nombre del Menú</label>
                        <InputText id="menuName" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="menuDescription">Descripción</label>
                        <InputText id="menuDescription" value={menuDescription} onChange={(e) => setMenuDescription(e.target.value)} />
                    </div>
                    <Button label="Guardar" icon="pi pi-check" onClick={handleAddMenu} className="p-button-success" />
                </div>
            </Dialog>

            {/* Dialogo para actualizar menú */}
            <Dialog header="Actualizar Menú" visible={displayUpdateDialog} onHide={closeDialog}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="menuName">Nombre del Menú</label>
                        <InputText id="menuName" value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="menuDescription">Descripción</label>
                        <InputText id="menuDescription" value={menuDescription} onChange={(e) => setMenuDescription(e.target.value)} />
                    </div>
                    <Button label="Actualizar" icon="pi pi-pencil" onClick={handleUpdateMenu} className="p-button-warning" />
                </div>
            </Dialog>

            {/* Dialogo para eliminar menú */}
            <Dialog header="Eliminar Menú" visible={displayDeleteDialog} onHide={closeDialog}>
                <p>¿Estás seguro de que deseas eliminar este menú?</p>
                <Button label="Eliminar" icon="pi pi-trash" onClick={handleDeleteMenu} className="p-button-danger" />
            </Dialog>

            {/* Dialogo para ver pedidos */}
            <Dialog header="Ver Pedidos" visible={displayOrdersDialog} onHide={closeDialog}>
                <Card title="Pedidos Recientes">
                    {/* Aquí puedes listar los pedidos, por ejemplo, usando una tabla o lista */}
                    <ul>
                        <li>Pedido #1 - $20</li>
                        <li>Pedido #2 - $30</li>
                    </ul>
                </Card>
            </Dialog>
        </div>
    );
}

export default AdminPage;
