import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Link } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!username || !password) {
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor complete todos los campos',
                life: 3000
            });
            return;
        }

        try {
            setLoading(true);

            const verifyResponse = await fetch(
                `http://localhost:8080/usuarios/verificarPassword?usuario=${username}&contrasena=${password}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (verifyResponse.status === 200) {
                const usersResponse = await fetch('http://localhost:8080/usuarios', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (usersResponse.ok) {
                    const users = await usersResponse.json();
                    const currentUser = users.find(user => user.usuario === username);

                    if (currentUser) {
                        onLogin(currentUser);
                        toast.current.show({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Inicio de sesión exitoso',
                            life: 3000
                        });
                        navigate('/home');
                    }
                }
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Usuario o contraseña incorrectos',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al iniciar sesión',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Toast ref={toast} />
            <div className="login-box">
                <div className="login-image-side">
                    <div className="overlay">
                        <h2>Bienvenido de nuevo</h2>
                        <p>Inicia sesión para acceder a tu cuenta</p>
                    </div>
                </div>
                
                <div className="login-form-side">
                    <div className="login-header">
                        <h1>Iniciar Sesión</h1>
                        <p>¡Nos alegra verte de nuevo!</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                    placeholder="Ingresa tu usuario"
                                    className="w-full"
                                />
                            </span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                toggleMask
                                feedback={false}
                                disabled={loading}
                                placeholder="Ingresa tu contraseña"
                                className="w-full"
                            />
                        </div>

                        <Button
                            label="Iniciar Sesión"
                            icon="pi pi-sign-in"
                            loading={loading}
                            disabled={!username || !password || loading}
                            className="login-button"
                        />

                        <div className="register-prompt">
                            ¿No tienes una cuenta? {' '}
                            <Link to="/registro" className="register-link">
                                Regístrate aquí
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;