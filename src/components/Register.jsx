import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  UserIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  PhoneIcon 
} from '@heroicons/react/24/solid'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Register:', formData)
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
        <div className="auth-image-side register">
          <div className="auth-overlay">
            <h2>Únete a nuestra familia</h2>
            <p>Disfruta de una experiencia gastronómica única</p>
          </div>
        </div>
        
        <div className="auth-form-side">
          <div className="auth-form-container">
            <h1>Crear Cuenta</h1>
            <p className="auth-subtitle">¡Bienvenido a nuestra comunidad!</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>
                  <UserIcon className="form-icon" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                />
              </div>

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
                  <PhoneIcon className="form-icon" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 123 456 789"
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

              <div className="form-group">
                <label>
                  <LockClosedIcon className="form-icon" />
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="auth-submit">
                Crear Cuenta
              </button>
            </form>

            <p className="auth-redirect">
              ¿Ya tienes una cuenta? {' '}
              <Link to="/login" className="auth-link">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register 