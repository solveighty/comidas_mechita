import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useRef } from 'react';
import '../styles/Layout.css';

function Layout({ children, onLogout, cartItemsCount, userData }) {
    const userMenu = useRef(null);
    const navigate = useNavigate();

    const userMenuItems = [
        {
            label: 'Ver Perfil',
            icon: 'pi pi-user',
            command: (e) => {
                navigate('/perfil');
            }
        },
        {
            label: 'Configurar Cuenta',
            icon: 'pi pi-cog',
            command: (e) => {
                navigate('/configuracion');
            }
        },
        {
            label: 'Ver Carrito',
            icon: 'pi pi-shopping-cart',
            template: (item) => (
                <div className="menu-item-content">
                    <i className={`${item.icon} menu-item-icon`}></i>
                    <span>{item.label}</span>
                    {cartItemsCount > 0 && (
                        <span className="cart-badge">{cartItemsCount}</span>
                    )}
                </div>
            ),
            command: (e) => {
                navigate('/carrito');
            }
        },
        {
            separator: true
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: (e) => {
                onLogout();
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
                        dismissable={true}
                        autoZIndex
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