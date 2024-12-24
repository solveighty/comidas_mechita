import React, { useState, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import AddMenu from './AddMenu';
import Pedido from './Pedido';
import DeleteMenu from './DeleteMenu';
import UpdateMenu from './UpdateMenu';
import HistorialVentas from './HistorialVentas';



export default function AdminMenu({ userData }) {
    const [displayAddDialog, setDisplayAddDialog] = useState(false);
    const [displayUpdateDialog, setDisplayUpdateDialog] = useState(false);
    const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
    const [displayOrdersDialog, setDisplayOrdersDialog] = useState(false); 
    const [displayVentasDialog, setDisplayVentasDialog] = useState(false); 
    const toast = useRef(null);

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
                setDisplayOrdersDialog(true); 
                break;
            case 'ventas':
                setDisplayVentasDialog(true);
                break;
            default:
                break;
        }
    };

    const closeDialog = () => {
        setDisplayAddDialog(false);
        setDisplayUpdateDialog(false);
        setDisplayDeleteDialog(false);
        setDisplayOrdersDialog(false); 
        setDisplayVentasDialog(false);
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
        {
            label: 'Ver Ventas',
            icon: 'pi pi-chart-line',
            command: () => openDialog('ventas'),
        },
    ];

    return (
        <div className="admin-container">
            <Toast ref={toast} />
            <Menubar model={items} />

            {/* Diálogos */}
            <Dialog
                header="Agregar Menú"
                visible={displayAddDialog}
                onHide={closeDialog}
                draggable={false}
            >
                {/* Aquí va el contenido del diálogo de agregar */}

                <AddMenu userId={userData.id} toast={toast} onClose={closeDialog} />
            </Dialog>

            <Dialog
                header="Actualizar Menú"
                visible={displayUpdateDialog}
                onHide={closeDialog}
                draggable={false}
            >
                {/* Aquí va el contenido del diálogo de actualizar */}
                <UpdateMenu userId={userData.id} toast={toast} onClose={closeDialog} />
            </Dialog>

            <Dialog
                header="Eliminar Menú"
                visible={displayDeleteDialog}
                onHide={closeDialog}
                draggable={false}
            >
                {/* Aquí va el contenido del diálogo de eliminar */}
                <DeleteMenu userId={userData.id} toast={toast} onClose={closeDialog} />
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

            <Dialog
                header="Historial de Ventas"
                visible={displayVentasDialog}
                onHide={closeDialog}
                style={{ width: '50vw' }}
                draggable={false}
            >
                <HistorialVentas userData={userData} toast={toast} />
            </Dialog>
        </div>
    );
}
