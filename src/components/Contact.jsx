import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/solid'
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaWhatsapp
} from 'react-icons/fa'

function Contact() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Contacto</h1>
        <p>¡Estamos aquí para atenderte!</p>
      </header>

      <div className="page-content">
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-card">
              <PhoneIcon className="contact-icon" />
              <h3>Teléfono</h3>
              <p>+34 123 456 789</p>
              <p>+34 987 654 321</p>
            </div>

            <div className="contact-card">
              <EnvelopeIcon className="contact-icon" />
              <h3>Email</h3>
              <p>info@restaurante.com</p>
              <p>reservas@restaurante.com</p>
            </div>

            <div className="contact-card">
              <MapPinIcon className="contact-icon" />
              <h3>Ubicación</h3>
              <p>Calle Principal 123</p>
              <p>Madrid, España</p>
            </div>

            <div className="contact-card">
              <ClockIcon className="contact-icon" />
              <h3>Horario</h3>
              <p>Lunes a Viernes: 12:00 - 23:00</p>
              <p>Sábado y Domingo: 13:00 - 00:00</p>
            </div>
          </div>

          <div className="social-container">
            <h2>Síguenos en Redes Sociales</h2>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <FaFacebook />
                <span>Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <FaInstagram />
                <span>Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                <FaTwitter />
                <span>Twitter</span>
              </a>
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact 