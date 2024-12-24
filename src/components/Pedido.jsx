import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import '../styles/Pedido.css';
import url_Backend from './config';

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
            fetch(`http://${url_Backend}:8080/historial/all?userId=${userData.id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error fetching orders');
                    }
                    return response.json();
                })
                .then((data) => {
                    setPedidos(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching orders:', error);
                    setLoading(false);
                });
        }
    }, [userData]);

    const handleEstadoChange = (pedidoId, nuevoEstado) => {
        if (!userData || !userData.id) return;

        fetch(`http://${url_Backend}:8080/historial/actualizar-estado/${pedidoId}?userId=${userData.id}&nuevoEstado=${nuevoEstado}`, {
            method: 'PUT',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error updating order status');
                }
                return response.json();
            })
            .then(() => {
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
            <Card key={pedido.id} className="pedido-card">
                <div className="pedido-info">
                    <div className="pedido-header">
                        <span>ID Pedido: <strong>{pedido.id}</strong></span>
                        <span>Fecha: {new Date(pedido.fechaCompra).toLocaleDateString()}</span>
                    </div>
                    <div>Cliente: <strong>{pedido.usuario.nombre}</strong></div>
                    <div>
                        Estado: 
                        <Dropdown
                            value={pedido.estadoCompra}
                            options={estadoOptions}
                            onChange={(e) => handleEstadoChange(pedido.id, e.value)}
                            className="estado-dropdown"
                            placeholder="Seleccionar estado"
                        />
                    </div>
                </div>
                <div className="pedido-detalles">
                    <strong>Detalles del Pedido:</strong>
                    <ul>
                        {pedido.detalles.map((detalle) => (
                            <li key={detalle.id}>
                                {detalle.nombreMenu} x{detalle.cantidad} - ${detalle.precio.toFixed(2)} USD
                            </li>
                        ))}
                    </ul>
                    <div className="pedido-total">Total: <strong>${total.toFixed(2)} USD</strong></div>
                </div>
            </Card>
        );
    };

    return (
        <div className="pedidos-container">
            {loading ? (
                <p className="loading-text">Cargando...</p>
            ) : (
                <div className="pedidos-list">
                    {pedidos
                        .filter((pedido) => pedido.estadoCompra !== 'ENTREGADO') // Filtrar los pedidos que no están entregados
                        .map(itemTemplate)}
                </div>
            )}
        </div>
    );
}