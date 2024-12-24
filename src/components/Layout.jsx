import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import Navbar from './Navbar'; 
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import url_Backend from './config';

function Layout({ children, onLogout, cartItemsCount, userData }) {
    const userMenu = useRef(null);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    // Verificar si el usuario es administrador
    useEffect(() => {
        async function verificarAdmin() {
            try {
                const response = await fetch(`http://${url_Backend}:8080/usuarios/${userData?.id}/esAdmin`);
                if (!response.ok) {
                    throw new Error('Error al verificar si el usuario es admin');
                }
                const isAdmin = await response.json();
                setIsAdmin(isAdmin);
            } catch (error) {
                console.error('Error verificando si el usuario es admin:', error);
            }
        }
        if (userData) {
            verificarAdmin();
        }
    }, [userData]);

    // Opciones del menú de usuario
    const userMenuItems = [
        {
            label: 'Ver Perfil',
            icon: 'pi pi-user',
            command: () => navigate('/perfil'),
        },
        {
            label: 'Configurar Cuenta',
            icon: 'pi pi-cog',
            command: () => navigate('/configuracion'),
        },
        ...(isAdmin ? [
            {
                label: 'Administrar',
                icon: 'pi pi-cog',
                command: () => navigate('/admin'),
            },
        ] : []),
        {
            separator: true,
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => onLogout(),
        },
    ];

    // Función para redirigir a las rutas de menú
    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="layout-container" style={{ backgroundColor: "#f8f8f8" }}>
            {/* Navbar con botones de usuario y carrito */}
            <Navbar 
                onLogout={onLogout} 
                cartItemsCount={cartItemsCount} 
                userData={userData}
                handleNavigation={handleNavigation} 
                userMenuItems={userMenuItems} 
                userMenu={userMenu}
            />

            {/* Contenedor de contenido principal */}
            <div className="p-mb-4">
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
}

export default Layout;
