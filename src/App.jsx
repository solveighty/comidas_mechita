import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Menu from './components/Menu';
import Contact from './components/Contact';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Cart from './components/Cart';
import AdminPage from './components/AdminPage';
import Pedidos from './components/Pedidos';
import Notifications from './components/Notificaciones';

function App() {
  // Cargar el estado desde localStorage al inicio
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const [cartItems, setCartItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setUserData(data);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(data));

    // Verificar si el usuario es admin al momento de login
    fetch(`http://localhost:8080/usuarios/${data.id}/esAdmin`)
      .then(response => response.json())
      .then(isAdminResponse => {
        setIsAdmin(isAdminResponse);
        localStorage.setItem('isAdmin', isAdminResponse);
      })
      .catch((error) => console.error('Error verifying admin status:', error));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    setCartItems([]);
    setIsAdmin(false);
    // Limpiar localStorage al hacer logout
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Register />} />

        {isAuthenticated ? (
          <>
            <Route path="/" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Home userData={userData} /></Layout>} />
            <Route path="/menu" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Menu userData={userData} /></Layout>} />
            <Route path="/contacto" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Contact /></Layout>} />
            <Route path="/perfil" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Profile userData={userData} /></Layout>} />
            <Route path="/configuracion" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Settings userData={userData} /></Layout>} />
            <Route path="/admin" element={isAdmin ? <Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><AdminPage userData={userData} /></Layout> : <Navigate to="/login" replace />} />
            <Route path="/carrito" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Cart userData={userData} /></Layout>} />
            <Route path="/pedidos" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData}><Pedidos userId={userData.id} /></Layout>} />
            <Route path="/notificaciones" element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} userData={userData} unreadCount={unreadCount}><Notifications userData={userData} setUnreadCount={setUnreadCount} isAdmin={isAdmin} /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;