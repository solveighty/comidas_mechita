import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../styles/RestaurantRegister.css'; // Archivo CSS personalizado

function RestaurantRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, username, password, confirmPassword, terms } = formData;

    // Validaciones de campos obligatorios
    if (!fullName || !email || !username || !password || !confirmPassword || !terms) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos y acepte los términos',
        life: 3000,
      });
      return;
    }

    // Validación de contraseñas coincidentes
    if (password !== confirmPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
        life: 3000,
      });
      return;
    }

    // Preparar datos para enviar al backend
    const userData = {
      id: 0, // Asumimos que el ID lo genera el backend
      usuario: username,
      nombre: fullName,
      contrasena: password,
      telefono: '', // Campo opcional
      email: email,
      direccion: '', // Campo opcional
      rol: 'NORMAL', // Rol por defecto
    };

    try {
      setLoading(true); // Activar indicador de carga

      // Enviar datos al backend
      const response = await fetch('http://localhost:8080/usuarios/crearusuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      setLoading(false); // Desactivar indicador de carga

      if (response.ok) {
        toast.current.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario registrado exitosamente',
          life: 3000,
        });
        navigate('/login'); // Redirigir al inicio de sesión
      } else {
        const errorData = await response.json();
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorData.message || 'Error al registrar el usuario',
          life: 3000,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error al conectar con el servidor:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo conectar con el servidor',
        life: 3000,
      });
    }
  };


  return (
    <div className="restaurant-register">
      <Toast ref={toast} />
      <div className="image-side">
        <div className="overlay">
          <h2>¡Únete a nuestra comunidad culinaria!</h2>
          <p>Disfruta de un menú exclusivo y personalizado</p>
        </div>
      </div>

      <div className="form-side">
        <h1>Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo</label>
            <InputText
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ejemplo: Juan Pérez"
              className="w-full"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="w-full"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <InputText
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ejemplo: juan123"
              className="w-full"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              toggleMask
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              toggleMask
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <div className="form-group-checkbox">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <label htmlFor="terms">
              Acepto los <a href="/terms">términos y condiciones</a>
            </label>
          </div>

          <Button
            label="Registrar"
            icon="pi pi-user-plus"
            loading={loading}
            disabled={loading}
            className="register-button"
          />

          <div className="login-prompt">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RestaurantRegister;
