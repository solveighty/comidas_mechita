import { Card } from 'primereact/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFacebookF, 
    faInstagram, 
    faTwitter, 
    faWhatsapp,
    faTelegram 
} from '@fortawesome/free-brands-svg-icons';
import { 
    faLocationDot,
    faPhone,
    faClock,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import '../styles/Contact.css';


function Contact() {
    const socialMedia = [
        {
            name: 'Facebook',
            icon: faFacebookF,
            url: 'https://www.facebook.com/romanpaulov/',
            color: '#1877f2'
        },
        {
            name: 'Instagram',
            icon: faInstagram,
            url: 'https://www.instagram.com/romanpaulov/',
            color: '#e4405f'
        },
        {
            name: 'Twitter',
            icon: faTwitter,
            url: 'https://twitter.com/turestaurante',
            color: '#1da1f2'
        },
        {
            name: 'WhatsApp',
            icon: faWhatsapp,
            url: 'https://wa.me/tunumero',
            color: '#25d366'
        },{
            name: 'Telegram',
            icon: faTelegram,
            url: 'https://web.telegram.org/k/#@ComidasMechita_bot',
            color: '#0088cc'
        }

    ];

    return (
        <div className="contact-container">
            <h1 className="contact-title">Contáctanos</h1>
            
            <div className="contact-content">
                <div className="contact-info-section">
                    <Card className="contact-card info-card">
                        <h2>Información de Contacto</h2>
                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="contact-icon">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </span>
                                <div className="contact-text">
                                    <h3>Ubicación</h3>
                                    <p>Av. Principal, Local #123</p>
                                    <p>Ciudad, Estado</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <span className="contact-icon">
                                    <FontAwesomeIcon icon={faPhone} />
                                </span>
                                <div className="contact-text">
                                    <h3>Teléfonos</h3>
                                    <p>+58 424-1234567</p>
                                    <p>+58 212-1234567</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <span className="contact-icon">
                                    <FontAwesomeIcon icon={faClock} />
                                </span>
                                <div className="contact-text">
                                    <h3>Horario</h3>
                                    <p>Lunes a Viernes: 8:00 AM - 10:00 PM</p>
                                    <p>Sábados y Domingos: 9:00 AM - 11:00 PM</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <span className="contact-icon">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <div className="contact-text">
                                    <h3>Correo Electrónico</h3>
                                    <p>info@turestaurante.com</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="social-media-section">
                    <Card className="contact-card social-card">
                        <h2>Síguenos en Redes Sociales</h2>
                        <div className="social-buttons">
                            {socialMedia.map((social) => (
                                <a 
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    title={social.name}
                                >
                                    <span 
                                        className="social-icon"
                                        style={{ backgroundColor: social.color }}
                                    >
                                        <FontAwesomeIcon icon={social.icon} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Contact;