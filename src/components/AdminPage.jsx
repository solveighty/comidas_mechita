import React, { useState, useRef, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import AddMenu from './AddMenu';
import Pedido from './Pedido';
import DeleteMenu from './DeleteMenu';
import UpdateMenu from './UpdateMenu';
import HistorialVentas from './HistorialVentas';
import { Paginator } from 'primereact/paginator';
import axios from 'axios';
import '../styles/Notifications.css';

export default function AdminMenu({ userData }) {
    const [displayAddDialog, setDisplayAddDialog] = useState(false);
    const [displayUpdateDialog, setDisplayUpdateDialog] = useState(false);
    const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
    const [displayOrdersDialog, setDisplayOrdersDialog] = useState(false); 
    const [displayVentasDialog, setDisplayVentasDialog] = useState(false); 
    const [notificaciones, setNotificaciones] = useState([]);
    const [displayNotificationDialog, setDisplayNotificationDialog] = useState(false);
    const [first, setFirst] = useState(0); // Paginación
    const [rows, setRows] = useState(5);  // Cantidad de notificaciones por página
    const toast = useRef(null);

    // Función para obtener las notificaciones
    const fetchNotificaciones = () => {
        fetch(`http://localhost:8080/notificaciones/administrador/${userData.id}`)
            .then((response) => response.json())
            .then((data) => {
                // Formatear la fecha y ordenar las notificaciones (nuevas al principio)
                const updatedNotificaciones = data.map((notif) => {
                    const date = new Date(notif.fecha);
                    const formattedDate = date.toLocaleString(); 
                    return {
                        ...notif,
                        fecha: formattedDate, 
                    };
                }).reverse(); // Invertir el orden para que las nuevas aparezcan primero
                setNotificaciones(updatedNotificaciones);
            });
    };

    // Llamamos a la función fetchNotificaciones cuando el componente se monta
    useEffect(() => {
        fetchNotificaciones();

        // Configuramos el polling cada 10 segundos para actualizar las notificaciones
        const intervalId = setInterval(fetchNotificaciones, 10000);

        // Limpiamos el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, [userData.id]);

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
            case 'notifications':
                setDisplayNotificationDialog(true); 
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
        setDisplayNotificationDialog(false); 
    };

    const handlePageChange = (event) => {
        setFirst(event.first); // Establecer la primera notificación de la página actual
        setRows(event.rows);   // Establecer el número de notificaciones por página
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
        {
            label: 'Notificaciones',
            icon: 'pi pi-bell',
            command: () => openDialog('notifications'),
        }
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
                <AddMenu userId={userData.id} toast={toast} onClose={closeDialog} />
            </Dialog>

            <Dialog
                header="Actualizar Menú"
                visible={displayUpdateDialog}
                onHide={closeDialog}
                draggable={false}
            >
                <UpdateMenu userId={userData.id} toast={toast} onClose={closeDialog} />
            </Dialog>

            <Dialog
                header="Eliminar Menú"
                visible={displayDeleteDialog}
                onHide={closeDialog}
                draggable={false}
            >
                <DeleteMenu userId={userData.id} toast={toast} onClose={closeDialog} />
            </Dialog>

            <Dialog
                header="Ver Pedidos"
                visible={displayOrdersDialog}
                onHide={closeDialog}
                style={{ width: '50vw' }} 
                draggable={false}
            >
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

            {/* Diálogo de Notificaciones */}
            <Dialog
                header="Notificaciones"
                visible={displayNotificationDialog}
                onHide={closeDialog}
                style={{ width: '50vw' }}
                draggable={false}
            >
                <div className="notifications-container">
                    <h2 className="notifications-title">Notificaciones</h2>
                    <ul className="notifications-list">
                        {notificaciones.slice(first, first + rows).map((notification) => (
                            <li
                                key={notification.id}
                                className={`notification-item ${notification.leida ? 'read' : 'unread'}`}
                            >
                                <div className="notification-message">{notification.mensaje}</div>
                                <div className="notification-date">{notification.fecha}</div>
                            </li>
                        ))}
                    </ul>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={notificaciones.length}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Dialog>
        </div>
    );
}