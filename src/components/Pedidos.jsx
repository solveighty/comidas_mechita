import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import '../styles/Pedidos.css';
import url_Backend from './config';

function Pedidos({ userId }) {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPedidos, setExpandedPedidos] = useState({});
  const [selectedEstado, setSelectedEstado] = useState('TODOS');
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [itemsPerPage, setItemsPerPage] = useState(5); // Elementos por página

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

        const pedidosOrdenados = data.sort(
          (a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra)
        );

        setPedidos(pedidosOrdenados);
        setFilteredPedidos(pedidosOrdenados);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHistorialPedidos();
  }, [userId]);

  useEffect(() => {
    if (selectedEstado === 'TODOS') {
      setFilteredPedidos(pedidos);
    } else {
      setFilteredPedidos(pedidos.filter((pedido) => pedido.estadoCompra === selectedEstado));
    }
    setCurrentPage(0); // Reinicia a la primera página al filtrar
  }, [selectedEstado, pedidos]);

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

  const onPageChange = (event) => {
    setCurrentPage(event.first / itemsPerPage);
  };

  // Calcular pedidos para la página actual
  const pedidosPaginados = filteredPedidos.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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

  return (
    <div className="p-m-4 pedidos-container">
      <h2>Historial de Pedidos</h2>
      <p>Consulta tus pedidos realizados y sus detalles.</p>

      <div className="dropdown-container">
        <Dropdown
          value={selectedEstado}
          options={estadosDisponibles}
          onChange={(e) => setSelectedEstado(e.value)}
          placeholder="Selecciona un estado"
          className="p-mb-3"
        />
      </div>

      <div className="p-grid p-dir-col">
        {pedidosPaginados.map((pedido) => (
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

      <Paginator
        first={currentPage * itemsPerPage}
        rows={itemsPerPage}
        totalRecords={filteredPedidos.length}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default Pedidos;
