import { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

function Cart({ userData }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.id) {
            fetchCartItems();
        }
    }, [userData]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`http://localhost:8080/usuarios`);
            
            if (!response.ok) {
                throw new Error('Error al cargar el carrito');
            }

            const users = await response.json();
            const currentUser = users.find(user => user.id === userData.id);
            
            if (currentUser && currentUser.carrito && currentUser.carrito.items) {
                setCartItems(currentUser.carrito.items);
            } else {
                setCartItems([]);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los items del carrito',
                life: 3000
            });
            setLoading(false);
        }
    };

    const removeItem = async (carritoId, itemId) => {
        try {
            const response = await fetch(`http://localhost:8080/carrito/eliminar/${carritoId}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el item');
            }

            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Producto eliminado del carrito',
                life: 3000
            });

            // Actualizar la lista de items
            fetchCartItems();

        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el producto',
                life: 3000
            });
        }
    };

    const calculateTotal = () => {
        if (!cartItems || cartItems.length === 0) return 0;
        
        return cartItems.reduce((total, item) => {
            const precio = item.menu?.precio || 0;
            const cantidad = item.cantidad || 0;
            return total + (precio * cantidad);
        }, 0);
    };

    const handlePayment = async () => {
        try {
            if (!userData?.carrito?.id) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se encontró el carrito',
                    life: 3000
                });
                return;
            }

            const response = await fetch(`http://localhost:8080/carrito/pagar/${userData.carrito.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al procesar el pago');
            }

            toast.current.show({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'Pago procesado correctamente',
                life: 3000
            });

            // Actualizar el carrito después del pago
            await fetchCartItems();

        } catch (error) {
            console.error('Error:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo procesar el pago',
                life: 3000
            });
        }
    };

    return (
        <div className="cart-container">
            <Toast ref={toast} />
            <h1 className="cart-title">Mi Carrito</h1>

            {loading ? (
                <div className="cart-loading">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                    <p>Cargando carrito...</p>
                </div>
            ) : cartItems.length === 0 ? (
                <Card className="empty-cart">
                    <div className="empty-cart-content">
                        <i className="pi pi-shopping-cart" style={{ fontSize: '3rem' }}></i>
                        <h2>Tu carrito está vacío</h2>
                        <p>¡Agrega algunos productos deliciosos!</p>
                        <Button 
                            label="Ver Menú" 
                            icon="pi pi-list" 
                            onClick={() => navigate('/menu')}
                        />
                    </div>
                </Card>
            ) : (
                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <Card key={item.id} className="cart-item">
                                <div className="cart-item-content">
                                    <img 
                                        src={item.menu?.imagen} 
                                        alt={item.menu?.nombre} 
                                        className="cart-item-image"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevenir loop infinito
                                            e.target.style.display = 'none'; // Ocultar imagen si falla
                                        }}
                                    />
                                    <div className="cart-item-details">
                                        <h3>{item.menu?.nombre}</h3>
                                        <p className="cart-item-price">
                                            ${item.menu?.precio}
                                        </p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <span className="cart-item-quantity">
                                            Cantidad: {item.cantidad}
                                        </span>
                                        <Button 
                                            icon="pi pi-trash" 
                                            className="p-button-danger p-button-text" 
                                            onClick={() => removeItem(userData.carrito?.id, item.id)}
                                            tooltip="Eliminar"
                                        />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    
                    <Card className="cart-summary">
                        <h3>Resumen del Pedido</h3>
                        <div className="cart-summary-content">
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="summary-total">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <Button 
                                label="Proceder al Pago" 
                                icon="pi pi-shopping-cart"
                                className="p-button-success p-button-raised"
                                onClick={handlePayment}
                                disabled={cartItems.length === 0}
                            />
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default Cart;