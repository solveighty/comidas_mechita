import React, { useEffect, useState } from 'react';
import '../styles/Notifications.css';
import url_Backend from './config';

const Notifications = ({ userData, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Cantidad de notificaciones por página

  useEffect(() => {
    if (userData) {
      fetch(`http://${url_Backend}:8080/notificaciones/usuario/${userData.id}`)
        .then((response) => response.json())
        .then((data) => {
          // Filtrar notificaciones dependiendo de si es admin o no
          const filteredNotifications = data.filter((notification) => {
            return notification.tipoNotificacion === 'USUARIO';
          });

          // Ordenar por fecha descendente (nuevas primero)
          filteredNotifications.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );

          setNotifications(filteredNotifications);

          // Contar las notificaciones no leídas
          const unreadCount = filteredNotifications.filter(
            (notification) => !notification.leida
          ).length;
          setUnreadCount(unreadCount);
        })
        .catch((error) => console.error('Error fetching notifications:', error));
    }
  }, [userData, setUnreadCount]);

  // Calcular el índice de las notificaciones que se muestran en la página actual
  const indexOfLastNotification = currentPage * itemsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - itemsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  // Cambiar de página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  return (
    <div className="notifications-container">
      <h3 className="notifications-title">Notificaciones</h3>
      <ul className="notifications-list">
        {currentNotifications.map((notification) => (
          <li
            key={notification.id}
            className={`notification-item ${notification.leida ? 'read' : 'unread'}`}
          >
            <div className="notification-message">{notification.mensaje}</div>
            <small className="notification-date">
              {new Date(notification.fecha).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      {/* Controles del paginador */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Notifications;
