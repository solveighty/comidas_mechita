import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import './Layout.css';

function Layout({ children, onLogout, cartItemsCount, userData }) {
    const userMenu = useRef(null);
    const navigate = useNavigate();

    const userMenuItems = [
        {
            label: 'Ver Perfil',
            icon: 'pi pi-user',
            command: () => {
                navigate('/perfil');
                userMenu.current.hide();
            }
        },
        {
            label: 'Configurar Cuenta',
            icon: 'pi pi-cog',
            command: () => {
                navigate('/configuracion');
                userMenu.current.hide();
            }
        },
        {
            label: 'Ver Carrito',
            template: (item) => (
                <button 
                    className="cart-button"
                    onClick={() => {
                        navigate('/carrito');
                        userMenu.current.hide();
                    }}
                >
                    <i className="pi pi-shopping-cart menu-item-icon"></i>
                    <span>Ver Carrito</span>
                    {cartItemsCount > 0 && (
                        <span className="cart-badge">{cartItemsCount}</span>
                    )}
                </button>
            )
        },
        {
            separator: true
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => {
                onLogout();
                userMenu.current.hide();
            }
        }
    ];

    return (
        <div className="layout-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <Link to="/home">Logo</Link>
                </div>
                <div className="nav-links">
                    <Link to="/home">Inicio</Link>
                    <Link to="/menu">Menu</Link>
                    <Link to="/contacto">Contacto</Link>
                </div>
                <div className="nav-actions">
                    <Button
                        icon="pi pi-user"
                        className="p-button-rounded p-button-text"
                        onClick={(e) => userMenu.current.toggle(e)}
                        aria-controls="user-menu"
                        aria-haspopup
                    />
                    <Menu
                        id="user-menu"
                        ref={userMenu}
                        model={userMenuItems}
                        popup
                        className="user-menu"
                    />
                </div>
            </nav>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default Layout;