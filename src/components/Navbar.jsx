import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/solid'

function Navbar({ onLogout, cartItemsCount = 0 }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef()

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleMenuItemClick = (path, action) => {
    setShowUserMenu(false) // Cerrar el menú
    if (action) {
      action()
    } else {
      navigate(path)
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/menu">Menú</Link>
        <Link to="/contacto">Contacto</Link>
      </div>
      
      <div className="user-menu" ref={menuRef}>
        <div onClick={handleUserMenuClick} style={{ position: 'relative' }}>
          <UserCircleIcon className="user-icon" />
          {cartItemsCount > 0 && (
            <span className="cart-count">{cartItemsCount}</span>
          )}
        </div>
        
        {showUserMenu && (
          <div className="user-menu-dropdown">
            <div 
              className="user-menu-item"
              onClick={() => handleMenuItemClick('/perfil')}
            >
              <UserIcon />
              Ver Perfil
            </div>
            <div 
              className="user-menu-item"
              onClick={() => handleMenuItemClick('/configuracion')}
            >
              <Cog6ToothIcon />
              Configurar Cuenta
            </div>
            <div 
              className="user-menu-item"
              onClick={() => handleMenuItemClick('/carrito')}
            >
              <ShoppingCartIcon />
              Ver Carrito
              {cartItemsCount > 0 && (
                <span>({cartItemsCount})</span>
              )}
            </div>
            <div 
              className="user-menu-item"
              onClick={() => handleMenuItemClick(null, onLogout)}
            >
              <ArrowRightOnRectangleIcon />
              Cerrar Sesión
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 