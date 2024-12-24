import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import '../styles/RestaurantRegister.css'; 
import url_Backend from './config';

function RestaurantRegister() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    terms: false,
    verificationCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); 
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

    if (!isCodeSent) {
      try {
        setLoading(true);

        // Enviar los datos como URL-encoded
        const formData = new URLSearchParams();
        formData.append('email', email);

        const response = await fetch(`http://${url_Backend}:8080/verification/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        setLoading(false);

        if (response.ok) {
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Código de verificación enviado a tu correo',
            life: 3000,
          });
          setIsCodeSent(true); // El código fue enviado
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al enviar el código de verificación',
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
      return; // Detener aquí si el código fue enviado
    }

    // Validación del código de verificación
    const { verificationCode } = formData;
    if (!verificationCode) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor ingresa el código de verificación',
        life: 3000,
      });
      return;
    }

    // Verificar el código
    try {
      setLoading(true);

      // Enviar los datos como URL-encoded
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('code', verificationCode);

      const response = await fetch(`http://${url_Backend}:8080/verification/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      setLoading(false);

      if (response.ok) {
        // Si la verificación es exitosa, crear el usuario
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

        // Enviar datos al backend para crear el usuario
        const createUserResponse = await fetch(`http://${url_Backend}:8080/usuarios/crearusuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (createUserResponse.ok) {
          toast.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario registrado exitosamente',
            life: 3000,
          });
          navigate('/login'); // Redirigir al inicio de sesión
        } else {
          const errorData = await createUserResponse.json();
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: errorData.message || 'Error al registrar el usuario',
            life: 3000,
          });
        }
      } else {
        const errorData = await response.json();
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: errorData.message || 'Código de verificación incorrecto',
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

          {isCodeSent && (
            <div className="form-group">
              <label htmlFor="verificationCode">Código de Verificación</label>
              <InputText
                id="verificationCode"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleChange}
                placeholder="Ingresa el código enviado a tu correo"
                className="w-full"
              />
            </div>
          )}

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
            label={isCodeSent ? 'Verificar y Registrar' : 'Enviar Código de Verificación'}
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
