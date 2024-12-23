import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';
import '../styles/HistorialVentas.css';

export default function HistorialVentas({ userData, toast }) {
    const [ventas, setVentas] = useState([]);
    const [rango, setRango] = useState('diario');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        fetchVentas();
    }, [rango]);

    const fetchVentas = async () => {
        setCargando(true);
        try {
            const response = await fetch(
                `http://localhost:8080/historial/ventas?userId=${userData.id}&rango=${rango}`
            );
            if (!response.ok) {
                throw new Error('Error al obtener las ventas');
            }
            const data = await response.json();

            // Ordenar las ventas por fecha (descendente)
            const ventasOrdenadas = data.historial.sort((a, b) =>
                new Date(b.fechaCompra) - new Date(a.fechaCompra)
            );

            setVentas(ventasOrdenadas);
            toast.current.show({
                severity: 'success',
                summary: 'Ventas cargadas',
                detail: `Se han cargado las ventas para el rango ${rango}`,
                life: 3000,
            });
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo obtener el historial de ventas',
                life: 3000,
            });
        } finally {
            setCargando(false);
        }
    };

    const opcionesRango = [
        { label: 'Diario', value: 'diario' },
        { label: 'Semanal', value: 'semanal' },
        { label: 'Mensual', value: 'mensual' },
        { label: 'Anual', value: 'anual' }
    ];

    const calcularTotalVenta = (detalles) => {
        return detalles.reduce((total, detalle) => {
            // Verificar los valores de precio y cantidad
            console.log('Precio:', detalle.precio, 'Cantidad:', detalle.cantidad);

            const totalItem = detalle.precio;

            return total + totalItem;
        }, 0);
    };

    const totalVentas = ventas.reduce((total, venta) => total + calcularTotalVenta(venta.detalles), 0);

    return (
        <div className="historial-container">
            <div className="p-d-flex p-jc-between p-ai-center">
                <h3>Historial de Ventas</h3>
                <div>
                    <Dropdown
                        value={rango}
                        options={opcionesRango}
                        onChange={(e) => setRango(e.value)}
                        placeholder="Selecciona un rango"
                        className="rango-dropdown"
                    />
                </div>
            </div>

            {cargando ? (
                <div className="loading-container">
                    <Skeleton width="100%" height="50px" className="loading-skeleton" />
                    <Skeleton width="100%" height="50px" className="loading-skeleton" />
                    <Skeleton width="100%" height="50px" className="loading-skeleton" />
                </div>
            ) : (
                <div>
                    <h4 className="rango-title">Ventas para el rango {rango}:</h4>
                    {ventas.length > 0 ? (
                        <div className="ventas-list">
                            {ventas.map((venta, index) => (
                                <Card key={index} className="venta-card">
                                    <h5>{venta.usuario.nombre} ({venta.usuario.usuario})</h5>
                                    <div className="venta-details">
                                        <p><strong>Fecha:</strong> {venta.fechaCompra}</p>
                                        <p><strong>Total del pedido:</strong> ${calcularTotalVenta(venta.detalles).toFixed(2)}</p>
                                        <div className="venta-items">
                                            <strong>Detalles:</strong>
                                            <ul>
                                                {venta.detalles.map((detalle, idx) => (
                                                    <li key={idx}>
                                                        {detalle.nombreMenu} x{detalle.cantidad} = $
                                                        {(detalle.precio).toFixed(2)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            <div className="total-container">
                                <h4>Total de las ventas: ${totalVentas.toFixed(2)}</h4>
                            </div>
                        </div>
                    ) : (
                        <p>No se encontraron ventas para este rango.</p>
                    )}
                </div>
            )}
        </div>
    );
}
