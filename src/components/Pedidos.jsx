import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import '../styles/Pedidos.css';
import url_Backend from './config';

function Pedidos({ userId }) {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPedidos, setExpandedPedidos] = useState({});
  const [selectedEstado, setSelectedEstado] = useState('TODOS');

  const estadosDisponibles = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'En proceso', value: 'EN_PROCESO' },
    { label: 'En tránsito', value: 'EN_TRANSITO' },
    { label: 'Entregado', value: 'ENTREGADO' },
  ];

  useEffect(() => {
    const fetchHistorialPedidos = async () => {
      try {
        const response = await fetch(`http://${url_Backend}:8080/historial/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el historial de pedidos');
        }
        const data = await response.json();

        // Ordenar pedidos por fecha de compra (nuevos primero)
        const pedidosOrdenados = data.sort(
          (a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)
        );

        setPedidos(pedidosOrdenados);
        setFilteredPedidos(pedidosOrdenados); // Inicialmente mostrar todos los pedidos
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHistorialPedidos();
  }, [userId]);

  useEffect(() => {
    // Filtrar pedidos según el estado seleccionado
    if (selectedEstado === 'TODOS') {
      setFilteredPedidos(pedidos);
    } else {
      setFilteredPedidos(pedidos.filter((pedido) => pedido.estadoCompra === selectedEstado));
    }
  }, [selectedEstado, pedidos]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <Message severity="error" text={error} />;
  }

  const calcularTotal = (detalles) => {
    return detalles
      .reduce((total, detalle) => total + detalle.precio * detalle.cantidad, 0)
      .toFixed(2);
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'EN_PROCESO':
        return <span className="estado-label estado-en-proceso">En proceso</span>;
      case 'EN_TRANSITO':
        return <span className="estado-label estado-en-transito">En tránsito</span>;
      case 'ENTREGADO':
        return <span className="estado-label estado-entregado">Entregado</span>;
      default:
        return <span className="estado-label estado-desconocido">Desconocido</span>;
    }
  };

  const toggleExpand = (pedidoId) => {
    setExpandedPedidos((prevState) => ({
      ...prevState,
      [pedidoId]: !prevState[pedidoId],
    }));
  };

  return (
    <div className="p-m-4 pedidos-container">
      <h2>Historial de Pedidos</h2>
      <p>Consulta tus pedidos realizados y sus detalles.</p>

      {/* Dropdown para filtrar por estado */}
      <div className="dropdown-container">
        <Dropdown
          value={selectedEstado}
          options={estadosDisponibles}
          onChange={(e) => setSelectedEstado(e.value)}
          placeholder="Selecciona un estado"
          className="p-mb-3"
        />
      </div>

      <div className="p-grid p-dir-col ">
        {filteredPedidos.map((pedido) => (
          <Card
            key={pedido.id}
            title={`Pedido #${pedido.id}`}
            subTitle={`Fecha: ${new Date(pedido.fechaCompra).toLocaleString()}`}
            className="pedido-card p-mb-3"
          >
            <div className="pedido-info">
              <div className="pedido-estado">{getEstadoLabel(pedido.estadoCompra)}</div>
              <div className="pedido-total">Total: ${calcularTotal(pedido.detalles)}</div>
              <div className="pedido-usuario">Usuario: {`${pedido.usuario.nombre} (${pedido.usuario.usuario})`}</div>
            </div>
            <Button
              label={expandedPedidos[pedido.id] ? 'Ocultar detalles' : 'Ver más'}
              className="p-button-outlined p-mt-2"
              onClick={() => toggleExpand(pedido.id)}
              style={{
                minWidth: '120px',
                backgroundColor: 'transparent',
                color: '#fff',
                borderColor: '#ffffff',
              }}
            />
            {expandedPedidos[pedido.id] && (
              <div className="pedido-detalles">
                <h4>Detalles:</h4>
                <ul>
                  {pedido.detalles.map((detalle) => (
                    <li key={detalle.id} className="detalle-item">
                      <div>
                        <strong>{detalle.nombreMenu}</strong>
                      </div>
                      <div>
                        Cantidad: {detalle.cantidad} | Precio: ${detalle.precio.toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Pedidos;
