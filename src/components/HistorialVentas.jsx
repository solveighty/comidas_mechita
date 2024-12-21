import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

export default function HistorialVentas({ userData, toast }) {
    const [ventas, setVentas] = useState([]);
    const [rango, setRango] = useState('diario'); // Por defecto, el rango es diario
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        // Cuando se cambia el rango, obtén las ventas correspondientes
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
            setVentas(data.historial);
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

    // Función para calcular el total de la venta
    const calcularTotalVenta = (detalles) => {
        return detalles.reduce((total, detalle) => total + detalle.precio * detalle.cantidad, 0);
    };

    // Calcular el total de todas las ventas
    const totalVentas = ventas.reduce((total, venta) => total + calcularTotalVenta(venta.detalles), 0);

    return (
        <div>
            <div className="p-d-flex p-jc-between p-ai-center">
                <h3>Historial de Ventas</h3>
                <div>
                    <Dropdown
                        value={rango}
                        options={opcionesRango}
                        onChange={(e) => setRango(e.value)}
                        placeholder="Selecciona un rango"
                    />
                </div>
            </div>

            {cargando ? (
                <div>Cargando...</div>
            ) : (
                <div>
                    <h4>Ventas para el rango {rango}:</h4>
                    {ventas.length > 0 ? (
                        <div>
                            <ul>
                                {ventas.map((venta, index) => (
                                    <li key={index}>
                                        <strong>Comprador:</strong> {venta.usuario.nombre} ({venta.usuario.usuario})<br />
                                        <strong>Fecha:</strong> {venta.fechaCompra}<br />
                                        <strong>Total del pedido:</strong> ${calcularTotalVenta(venta.detalles).toFixed(2)}<br />
                                        <strong>Detalles:</strong>
                                        <ul>
                                            {venta.detalles.map((detalle, idx) => (
                                                <li key={idx}>
                                                    {detalle.nombreMenu} x{detalle.cantidad} = $
                                                    {(detalle.precio * detalle.cantidad).toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                            <h4>Total de las ventas: ${totalVentas.toFixed(2)}</h4>
                        </div>
                    ) : (
                        <p>No se encontraron ventas para este rango.</p>
                    )}
                </div>
            )}
        </div>
    );
}
