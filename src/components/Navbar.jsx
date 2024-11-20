import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Menu } from 'primereact/menu';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';



function Navbar({ cartItemsCount, handleNavigation, userMenuItems, userMenu, userData, unreadCount  }) {
    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#333',
                color: 'white'
            }}
        >
            {/* Contenedor de la marca */}
            <Link to="/home" style={{ fontSize: '1.5rem', color: 'white' }}>
                COMIDAS MECHITA
            </Link>

            {/* Contenedor de los botones centrados (Inicio, Menú, Contacto) */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <Button
                    label="Inicio"
                    outlined
                    onClick={() => handleNavigation('/home')}
                    style={{
                        minWidth: '120px',
                        backgroundColor: 'transparent',
                        color: '#fff',
                        borderColor: '#ffffff',
                    }}
                />
                <Button
                    label="Menú"
                    outlined
                    onClick={() => handleNavigation('/menu')}
                    style={{
                        minWidth: '120px',
                        backgroundColor: 'transparent',
                        color: '#fff',
                        borderColor: '#ffffff',
                    }}
                />
                <Button
                    label="Contacto"
                    outlined
                    onClick={() => handleNavigation('/contacto')}
                    style={{
                        minWidth: '120px',
                        backgroundColor: 'transparent',
                        color: '#fff',
                        borderColor: '#ffffff',
                    }}
                />
            </div>

            {/* Contenedor de los botones del carrito y usuario alineados a la derecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Pasamos userData al componente Notificaciones */}
                <Link to="/notificaciones">
                    <Button
                        icon="pi pi-bell"
                        outlined
                        style={{
                            backgroundColor: 'transparent',
                            color: '#fff',
                            borderColor: '#ffffff',
                        }}
                    />
                    {unreadCount > 0 && (
                        <Badge value={unreadCount} className="p-ml-2" severity="danger" />
                    )}
                </Link>

                <Link to="/carrito">
                    <Button
                        icon="pi pi-shopping-cart"
                        outlined
                        style={{
                            backgroundColor: 'transparent',
                            color: '#fff',
                            borderColor: '#ffffff',
                        }}
                    />
                    {cartItemsCount > 0 && (
                        <Badge value={cartItemsCount} className="p-ml-2" />
                    )}
                </Link>
                <Link to="/pedidos">
                    <Button
                        icon="pi pi-clipboard"
                        outlined
                        style={{
                            backgroundColor: 'transparent',
                            color: '#fff',
                            borderColor: '#ffffff',
                        }}
                    />
                </Link>
                {/* Botón de usuario */}
                <Button
                    icon="pi pi-user"
                    outlined
                    onClick={(e) => userMenu.current.toggle(e)}
                    aria-controls="user-menu"
                    aria-haspopup
                    style={{
                        backgroundColor: 'transparent',
                        color: '#fff',
                        borderColor: '#ffffff',
                    }}
                />
                <Menu
                    id="user-menu"
                    ref={userMenu}
                    model={userMenuItems}
                    popup
                    className="user-menu"
                    dismissable
                    autoZIndex
                />
            </div>
        </nav>
    );
}

export default Navbar;
