import { Link, NavLink } from 'react-router-dom';
import { Button } from 'primereact/button';
import './Navbar.css';

function Navbar({ onLogout, cartItemsCount, userData }) {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/home" className="navbar-brand">
                    Mi Restaurante
                </Link>
                <div className="navbar-menu">
                    <NavLink to="/home" className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                    }>
                        Inicio
                    </NavLink>
                    <NavLink to="/menu" className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                    }>
                        Menú
                    </NavLink>
                    <NavLink to="/contacto" className={({ isActive }) => 
                        isActive ? 'nav-link active' : 'nav-link'
                    }>
                        Contacto
                    </NavLink>
                </div>
                <div className="navbar-right">
                    <Button 
                        icon="pi pi-shopping-cart" 
                        badge={cartItemsCount.toString()} 
                        className="p-button-rounded"
                    />
                    <Button
                        icon="pi pi-user"
                        onClick={onLogout}
                        className="p-button-rounded p-button-text"
                        tooltip={`${userData?.nombre || 'Usuario'} (Cerrar sesión)`}
                        tooltipOptions={{ position: 'bottom' }}
                    />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;