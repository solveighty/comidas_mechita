import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

export default function Pedido({ userData }) {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const estadoOptions = [
        { label: 'En Proceso', value: 'EN_PROCESO' },
        { label: 'En Tránsito', value: 'EN_TRANSITO' },
        { label: 'Entregado', value: 'ENTREGADO' }
    ];

    useEffect(() => {
        if (userData && userData.id) {
            // Hacer la solicitud para obtener los pedidos del usuario
            fetch(`http://localhost:8080/historial/all?userId=${userData.id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error fetching orders');
                    }
                    return response.json();
                })
                .then((data) => {
                    setPedidos(data); // Establecer los pedidos obtenidos
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                    setLoading(false);
                });
        }
    }, [userData]);

    const handleEstadoChange = (pedidoId, nuevoEstado) => {
        if (!userData || !userData.id) return; // Asegurarse de que el usuario está autenticado como admin

        // Llamar al endpoint PUT para actualizar el estado del pedido
        fetch(`http://localhost:8080/historial/actualizar-estado/${pedidoId}?userId=${userData.id}&nuevoEstado=${nuevoEstado}`, {
            method: 'PUT',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error updating order status');
                }
                return response.json();
            })
            .then(() => {
                // Actualizar el estado del pedido localmente después de la actualización
                setPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido.id === pedidoId ? { ...pedido, estadoCompra: nuevoEstado } : pedido
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating order status:', error);
            });
    };

    const itemTemplate = (pedido) => {
        const total = pedido.detalles.reduce((acc, item) => acc + item.precio, 0);

        return (
            <Card key={pedido.id} className="mb-4">
                <div className="p-fluid">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-4">
                            <div className="font-bold">ID Pedido: {pedido.id}</div>
                            <div>Fecha de Compra: {new Date(pedido.fechaCompra).toLocaleDateString()}</div>
                            <div>Cliente: {pedido.usuario.nombre}</div>
                            <div>Estado: {pedido.estadoCompra}</div>

                            {/* Dropdown para cambiar el estado */}
                            <Dropdown
                                value={pedido.estadoCompra}
                                options={estadoOptions}
                                onChange={(e) => handleEstadoChange(pedido.id, e.value)}
                                placeholder="Seleccionar estado"
                            />
                        </div>
                        <div className="p-col-12 p-md-8">
                            <div className="font-bold">Detalles del Pedido:</div>
                            <ul>
                                {pedido.detalles.map((detalle) => (
                                    <li key={detalle.id}>
                                        <div>{detalle.nombreMenu} x{detalle.cantidad} - {detalle.precio} USD</div>
                                    </li>
                                ))}
                            </ul>
                            <div className="font-bold">Total: {total} USD</div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-d-flex p-flex-column p-ai-center">
            {loading ? (
                <p>Cargando...</p> // Mensaje mientras se cargan los datos
            ) : (
                <div className="p-d-flex p-flex-column p-ai-center p-mt-4">
                    {pedidos
                        .filter((pedido) => pedido.estadoCompra !== 'ENTREGADO') // Filtrar los pedidos que no están entregados
                        .map(itemTemplate)}
                </div>
            )}
        </div>
    );
}
