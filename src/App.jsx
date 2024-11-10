import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Menu from './components/Menu'
import Contact from './components/Contact'
import Profile from './components/Profile'
import Settings from './components/Settings'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const handleLogin = (data) => {
    setIsAuthenticated(true)
    setUserData(data)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserData(null)
    setCartItems([])
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/registro" element={<Register />} />
        
        {isAuthenticated ? (
          <>
            <Route 
              path="/home" 
              element={
                <Layout 
                  onLogout={handleLogout} 
                  cartItemsCount={cartItems.length} 
                  userData={userData}
                >
                  <Home />
                </Layout>
              } 
            />
            <Route 
              path="/menu" 
              element={
                <Layout 
                  onLogout={handleLogout} 
                  cartItemsCount={cartItems.length} 
                  userData={userData}
                >
                  <Menu />
                </Layout>
              } 
            />
            <Route 
              path="/contacto" 
              element={
                <Layout 
                  onLogout={handleLogout} 
                  cartItemsCount={cartItems.length} 
                  userData={userData}
                >
                  <Contact />
                </Layout>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <Layout 
                  onLogout={handleLogout} 
                  cartItemsCount={cartItems.length} 
                  userData={userData}
                >
                  <Profile userData={userData} />
                </Layout>
              } 
            />
            <Route 
              path="/configuracion" 
              element={
                <Layout 
                  onLogout={handleLogout} 
                  cartItemsCount={cartItems.length} 
                  userData={userData}
                >
                  <Settings userData={userData} />
                </Layout>
              } 
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
