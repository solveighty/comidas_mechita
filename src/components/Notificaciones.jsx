import React, { useEffect, useState } from 'react';


const Notifications = ({ userData, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    if (userData) {
      fetch(`http://localhost:8080/notificaciones/usuario/${userData.id}`)
        .then(response => response.json())
        .then(data => {
          // Filtrar notificaciones dependiendo de si es admin o no
          const filteredNotifications = data.filter((notification) => {

            return notification.tipoNotificacion === "USUARIO"; // Solo "USUARIO" si no es admin
          });
          setNotifications(filteredNotifications);
          const unreadCount = filteredNotifications.filter(notification => !notification.leida).length;
          setUnreadCount(unreadCount); // Actualiza el contador en el App.jsx
        })
        .catch((error) => console.error('Error fetching notifications:', error));
    }
  }, [userData, setUnreadCount]);

  return (
    <div>
      <h3>Notificaciones</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <div style={{ fontWeight: notification.leida ? 'normal' : 'bold' }}>
              {notification.mensaje}
            </div>
            <small>{new Date(notification.fecha).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
