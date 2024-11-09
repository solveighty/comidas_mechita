import { useState } from 'react'
import { 
  UserCircleIcon, 
  KeyIcon, 
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid'

function Settings() {
  const [formData, setFormData] = useState({
    currentUsername: '',
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para actualizar los datos
    console.log('Datos actualizados:', formData)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Configuración de Cuenta</h1>
        <p>Actualiza tus datos de acceso</p>
      </header>

      <div className="page-content">
        <div className="settings-container">
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-section">
              <h2>
                <UserCircleIcon className="settings-icon" />
                Cambiar Nombre de Usuario
              </h2>
              <div className="form-group">
                <label>Usuario Actual</label>
                <input
                  type="text"
                  name="currentUsername"
                  value={formData.currentUsername}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario actual"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nuevo Usuario</label>
                <input
                  type="text"
                  name="newUsername"
                  value={formData.newUsername}
                  onChange={handleChange}
                  placeholder="Ingresa el nuevo usuario"
                  required
                />
              </div>
            </div>

            <div className="settings-section">
              <h2>
                <KeyIcon className="settings-icon" />
                Cambiar Contraseña
              </h2>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Ingresa la nueva contraseña"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma la nueva contraseña"
                  required
                />
              </div>
            </div>

            <button type="submit" className="settings-submit">
              <ArrowPathIcon className="button-icon" />
              Actualizar Datos
            </button>

            {showSuccess && (
              <div className="success-message">
                <CheckCircleIcon className="success-icon" />
                ¡Datos actualizados correctamente!
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings 