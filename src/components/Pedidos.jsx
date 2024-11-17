import React, { useEffect, useState } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { PiTruck } from 'react-icons/pi'; // Ícono de camión

function Pedidos({ userId }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar el historial de pedidos
    const fetchHistorialPedidos = async () => {
      try {
        const response = await fetch(`http://localhost:8080/historial/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el historial de pedidos');
        }
        const data = await response.json();
        setPedidos(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchHistorialPedidos();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Función para calcular el total de cada pedido
  const calcularTotal = (detalles) => {
    return detalles.reduce((total, detalle) => {
      return total + detalle.precio;
    }, 0).toFixed(2); // Solo se suman los precios, no se multiplica por cantidad
  };

  // Función para obtener el ícono y texto del estado
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'En proceso':
        return { icon: <PiTruck style={{ color: 'orange' }} />, text: 'En proceso' };
      case 'En tránsito':
        return { icon: <PiTruck style={{ color: 'blue' }} />, text: 'En tránsito' };
      case 'Entregado':
        return { icon: <PiTruck style={{ color: 'green' }} />, text: 'Entregado' };
      default:
        return { icon: <PiTruck style={{ color: 'gray' }} />, text: 'Estado desconocido' };
    }
  };

  // Transformar los pedidos a nodos
  const transformarPedidosANodos = (pedidos) => {
    return pedidos.map((pedido) => {
      const estado = pedido.estado || 'En proceso';
      const total = calcularTotal(pedido.detalles); // Calcular total de la compra sumando los precios
      return {
        key: pedido.id,
        data: {
          fechaCompra: new Date(pedido.fechaCompra).toLocaleString(),
          estado: getEstadoIcon(estado),
          total, // Asignamos el total calculado
        },
        children: pedido.detalles.map((detalle) => ({
          key: detalle.id,
          data: {
            nombreMenu: detalle.nombreMenu,
            cantidad: detalle.cantidad,
            precio: detalle.precio,
            estado, // El mismo estado para todos los detalles
          },
        })),
      };
    });
  };

  const nodes = transformarPedidosANodos(pedidos);

  return (
    <div className="card">
      <TreeTable value={nodes} tableStyle={{ minWidth: '50rem' }}>
        <Column field="fechaCompra" header="Fecha de compra" expander />
        <Column
          field="estado"
          header="Estado"
          body={(rowData) => {
            const estado = rowData.data.estado || { icon: <PiTruck />, text: 'Desconocido' };
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {estado.icon}
                <span style={{ marginLeft: '8px' }}>{estado.text}</span>
              </div>
            );
          }}
        />
        <Column field="total" header="Total" body={(rowData) => <span>${rowData.data.total}</span>} />
        <Column field="nombreMenu" header="Nombre del Plato" />
        <Column field="cantidad" header="Cantidad" />
        <Column field="precio" header="Precio" />
      </TreeTable>
    </div>
  );
}

export default Pedidos;
