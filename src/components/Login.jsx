import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login:', formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-image-side">
          <div className="auth-overlay">
            <h2>Bienvenido de nuevo</h2>
            <p>Descubre nuestra deliciosa selección de platillos</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-form-container">
            <h1>Iniciar Sesión</h1>
            <p className="auth-subtitle">¡Nos alegra verte de nuevo!</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>
                  <EnvelopeIcon className="form-icon" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <LockClosedIcon className="form-icon" />
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" /> Recordarme
                </label>
                <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="auth-submit">
                Iniciar Sesión
              </button>
            </form>

            <p className="auth-redirect">
              ¿No tienes una cuenta? {' '}
              <Link to="/registro" className="auth-link">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 