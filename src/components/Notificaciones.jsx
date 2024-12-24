import React, { useEffect, useState } from 'react';
import '../styles/Notifications.css';
import url_Backend from './config';

const Notifications = ({ userData, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData) {
      fetch(`http://${url_Backend}:8080/notificaciones/usuario/${userData.id}`)
        .then((response) => response.json())
        .then((data) => {
          // Filtrar notificaciones dependiendo de si es admin o no
          const filteredNotifications = data.filter((notification) => {
            return notification.tipoNotificacion === "USUARIO";
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
        .catch((error) => console.error("Error fetching notifications:", error));
    }
  }, [userData, setUnreadCount]);

  return (
    <div className="notifications-container">
      <h3 className="notifications-title">Notificaciones</h3>
      <ul className="notifications-list">
        {notifications.map((notification) => (
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
    </div>
  );
};

export default Notifications;
