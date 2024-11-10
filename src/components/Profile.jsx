import { Card } from 'primereact/card';
import './Profile.css';

function Profile({ userData }) {
    return (
        <div className="profile-container">
            <h1 className="profile-title">Mi Perfil</h1>
            <Card className="profile-card">
                <div className="profile-info">
                    <div className="profile-item">
                        <h3>Nombre</h3>
                        <p>{userData?.nombre || 'No disponible'}</p>
                    </div>
                    <div className="profile-item">
                        <h3>Email</h3>
                        <p>{userData?.email || 'No disponible'}</p>
                    </div>
                    <div className="profile-item">
                        <h3>Teléfono</h3>
                        <p>{userData?.telefono || 'No disponible'}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Profile; 