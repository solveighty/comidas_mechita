import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import Pedido from './Pedido';

export default function AdminMenu({ userData }) {
    const [displayAddDialog, setDisplayAddDialog] = useState(false);
    const [displayUpdateDialog, setDisplayUpdateDialog] = useState(false);
    const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
    const [displayOrdersDialog, setDisplayOrdersDialog] = useState(false); // Nuevo estado para los pedidos

    const openDialog = (dialogType) => {
        switch (dialogType) {
            case 'add':
                setDisplayAddDialog(true);
                break;
            case 'update':
                setDisplayUpdateDialog(true);
                break;
            case 'delete':
                setDisplayDeleteDialog(true);
                break;
            case 'orders':
                setDisplayOrdersDialog(true); // Mostrar el diálogo de pedidos
                break;
            default:
                break;
        }
    };

    const closeDialog = () => {
        setDisplayAddDialog(false);
        setDisplayUpdateDialog(false);
        setDisplayDeleteDialog(false);
        setDisplayOrdersDialog(false); // Cerrar el diálogo de pedidos
    };

    const items = [
        {
            label: 'Agregar Menú',
            icon: 'pi pi-plus',
            command: () => openDialog('add'),
        },
        {
            label: 'Actualizar Menú',
            icon: 'pi pi-pencil',
            command: () => openDialog('update'),
        },
        {
            label: 'Eliminar Menú',
            icon: 'pi pi-trash',
            command: () => openDialog('delete'),
        },
        {
            label: 'Ver Pedidos',
            icon: 'pi pi-list',
            command: () => openDialog('orders'),
        },
    ];

    return (
        <div className="admin-container">
            <Menubar model={items} />

            {/* Diálogos */}
            <Dialog 
                header="Agregar Menú" 
                visible={displayAddDialog} 
                onHide={closeDialog}
                draggable={false}
            >
                {/* Aquí va el contenido del diálogo de agregar */}
                <p>Contenido para agregar menú</p>
            </Dialog>

            <Dialog 
                header="Actualizar Menú" 
                visible={displayUpdateDialog} 
                onHide={closeDialog}
                draggable={false}
            >
                {/* Aquí va el contenido del diálogo de actualizar */}
                <p>Contenido para actualizar menú</p>
            </Dialog>

            <Dialog 
                header="Eliminar Menú" 
                visible={displayDeleteDialog} 
                onHide={closeDialog}
                draggable={false}
            >
                {/* Aquí va el contenido del diálogo de eliminar */}
                <p>Contenido para eliminar menú</p>
            </Dialog>

            {/* Diálogo de Pedidos */}
            <Dialog 
                header="Ver Pedidos" 
                visible={displayOrdersDialog} 
                onHide={closeDialog}
                style={{ width: '50vw' }} // Puedes ajustar el tamaño del diálogo
                draggable={false}
            >
                {/* Aquí, pasamos los datos del pedido al componente Pedido */}
                <Pedido userData={userData} />
            </Dialog>
        </div>
    );
}
