import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './components/Home'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Contact from './components/Contact'
import Settings from './components/Settings'
import UnderConstruction from './components/UnderConstruction'
import Login from './components/Login'
import Register from './components/Register'
import menuItems from './data/menuItems.jsx'

function App() {
  const [cartItems, setCartItems] = useState([])

  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item])
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return;
    
    const updatedItems = cartItems.reduce((acc, item) => {
      if (item.id === itemId) {
        const currentQuantity = acc.filter(i => i.id === itemId).length;
        if (newQuantity > currentQuantity) {
          return [...acc, ...Array(newQuantity - currentQuantity).fill(item)];
        } else {
          const itemsToKeep = acc.filter(i => i.id === itemId).slice(0, newQuantity);
          return [...acc.filter(i => i.id !== itemId), ...itemsToKeep];
        }
      }
      return [...acc, item];
    }, []);
    
    setCartItems(updatedItems);
  }

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const handleLogout = () => {
    console.log('Cerrar sesión')
  }

  return (
    <Router>
      <Routes>
        {/* Rutas públicas sin Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas protegidas con Navbar */}
        <Route element={<Layout onLogout={handleLogout} cartItemsCount={cartItems.length} />}>
          <Route 
            path="/" 
            element={<Home menuItems={menuItems} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/menu" 
            element={<Menu menuItems={menuItems} onAddToCart={handleAddToCart} />} 
          />
          <Route 
            path="/perfil" 
            element={<UnderConstruction pageName="Mi Perfil" />} 
          />
          <Route 
            path="/configuracion" 
            element={<Settings />} 
          />
          <Route 
            path="/carrito" 
            element={
              <Cart 
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            } 
          />
          <Route 
            path="/contacto" 
            element={<Contact />} 
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
