import { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import '../styles/Settings.css';
import { ConfirmDialog } from 'primereact/confirmdialog';
import url_Backend from './config';

function Settings({ userData }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState({});
    const [updatedUserData, setUpdatedUserData] = useState(userData);
    const [formData, setFormData] = useState({
        id: userData?.id || '',
        usuario: '',
        nombre: '',
        contrasena: '',
        confirmarContrasena: '',
        contrasenaActual: '',
        telefono: '',
        email: '',
        direccion: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateField = async (fieldName) => {
        try {
            setLoading(prev => ({ ...prev, [fieldName]: true }));
    
            if (fieldName === 'contrasena') {
                if (!formData.contrasenaActual) {
                    throw new Error('Debe ingresar su contraseña actual');
                }
                if (formData.contrasena !== formData.confirmarContrasena) {
                    throw new Error('Las contraseñas nuevas no coinciden');
                }
                if (formData.contrasena.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }
            }
    
            const dataToSend = {
                id: updatedUserData.id,
                usuario: updatedUserData.usuario,
                nombre: updatedUserData.nombre,
                telefono: updatedUserData.telefono,
                email: updatedUserData.email,
                direccion: updatedUserData.direccion,
                contrasena: updatedUserData.contrasena,
                rol: userData.rol,
                [fieldName]: formData[fieldName]
            };
    
            const response = await fetch(`http://${url_Backend}:8080/usuarios/editarusuario/${updatedUserData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
    
            if (!response.ok) {
                throw new Error('Error al actualizar el campo');
            }
    
            const result = await response.json();
    
            // Actualiza el estado de 'updatedUserData' con los datos completos después de la actualización
            setUpdatedUserData(result);
    
            setFormData(prev => ({
                ...prev,
                [fieldName]: ''
            }));
    
            toast.current.show({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'Dato actualizado correctamente',
                life: 3000,
                icon: 'pi pi-check-circle'
            });
    
            if (fieldName === 'contrasena') {
                setFormData(prev => ({
                    ...prev,
                    contrasena: '',
                    confirmarContrasena: '',
                    contrasenaActual: ''
                }));
            }
    
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message,
                life: 3000,
                icon: 'pi pi-times-circle'
            });
        } finally {
            setLoading(prev => ({ ...prev, [fieldName]: false }));
        }
    };
    

    return (
        <div className="settings-container">
            <Toast ref={toast} position="bottom-right" />
            <ConfirmDialog />
            <h1 className="settings-title">Configuración de Cuenta</h1>
            
            <Card className="settings-card">
                <div className="settings-form">
                    <div className="form-field">
                        <label htmlFor="usuario">Usuario</label>
                        <div className="field-with-button">
                            <InputText
                                id="usuario"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleInputChange}
                                placeholder={updatedUserData?.usuario || 'No disponible'}
                                className="w-full"
                            />
                            <Button 
                                icon="pi pi-check"
                                onClick={() => handleUpdateField('usuario')}
                                loading={loading.usuario}
                                disabled={!formData.usuario || formData.usuario === updatedUserData?.usuario}
                                tooltip="Actualizar usuario"
                                className="p-button-success"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="nombre">Nombre</label>
                        <div className="field-with-button">
                            <InputText
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder={updatedUserData?.nombre || 'No disponible'}
                                className="w-full"
                            />
                            <Button 
                                icon="pi pi-check"
                                onClick={() => handleUpdateField('nombre')}
                                loading={loading.nombre}
                                disabled={!formData.nombre || formData.nombre === updatedUserData?.nombre}
                                tooltip="Actualizar nombre"
                                className="p-button-success"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Email</label>
                        <div className="field-with-button">
                            <InputText
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder={updatedUserData?.email || 'No disponible'}
                                className="w-full"
                            />
                            <Button 
                                icon="pi pi-check"
                                onClick={() => handleUpdateField('email')}
                                loading={loading.email}
                                disabled={!formData.email || formData.email === updatedUserData?.email}
                                tooltip="Actualizar email"
                                className="p-button-success"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="telefono">Teléfono</label>
                        <div className="field-with-button">
                            <InputText
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                placeholder={updatedUserData?.telefono || 'No disponible'}
                                className="w-full"
                            />
                            <Button 
                                icon="pi pi-check"
                                onClick={() => handleUpdateField('telefono')}
                                loading={loading.telefono}
                                disabled={!formData.telefono || formData.telefono === updatedUserData?.telefono}
                                tooltip="Actualizar teléfono"
                                className="p-button-success"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="direccion">Dirección</label>
                        <div className="field-with-button">
                            <InputText
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                placeholder={updatedUserData?.direccion || 'No disponible'}
                                className="w-full"
                            />
                            <Button 
                                icon="pi pi-check"
                                onClick={() => handleUpdateField('direccion')}
                                loading={loading.direccion}
                                disabled={!formData.direccion || formData.direccion === updatedUserData?.direccion}
                                tooltip="Actualizar dirección"
                                className="p-button-success"
                            />
                        </div>
                    </div>

                    <div className="password-section">
                        <h3>Cambiar Contraseña</h3>
                        <div className="form-field">
                            <label htmlFor="contrasenaActual">Contraseña Actual</label>
                            <Password
                                id="contrasenaActual"
                                name="contrasenaActual"
                                value={formData.contrasenaActual}
                                onChange={handleInputChange}
                                feedback={false}
                                className="w-full"
                                toggleMask
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="contrasena">Nueva Contraseña</label>
                            <Password
                                id="contrasena"
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleInputChange}
                                className="w-full"
                                toggleMask
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
                            <div className="field-with-button">
                                <Password
                                    id="confirmarContrasena"
                                    name="confirmarContrasena"
                                    value={formData.confirmarContrasena}
                                    onChange={handleInputChange}
                                    feedback={false}
                                    className="w-full"
                                    toggleMask
                                />
                                <Button 
                                    icon="pi pi-check"
                                    onClick={() => handleUpdateField('contrasena')}
                                    loading={loading.contrasena}
                                    disabled={!formData.contrasena || !formData.confirmarContrasena || !formData.contrasenaActual}
                                    tooltip="Actualizar contraseña"
                                    className="p-button-success"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Settings;