import { useEffect, useState, useRef } from 'react';
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import '../styles/Home.css';

function Home({ userData }) {
    const toast = useRef(null);
    const [featuredMenus, setFeaturedMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const categoryNames = {
        'PLATOS_ESPECIALES': 'Platos Especiales',
        'COMIDAS_RAPIDAS': 'Comidas Rápidas',
        'BOCADITOS': 'Bocaditos'
    };

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch('http://localhost:8080/menu');
                const data = await response.json();
                
                if (data && data.length > 0) {
                    const shuffled = data.sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 9);

                    const initialQuantities = {};
                    selected.forEach(menu => {
                        initialQuantities[menu.id] = 1;
                    });
                    setQuantities(initialQuantities);
                    setFeaturedMenus(selected);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const handleQuantityChange = (menuId, value) => {
        setQuantities(prev => ({
            ...prev,
            [menuId]: value
        }));
    };

    const checkIfItemInCart = async (menuId) => {
        try {
            const response = await fetch(`http://localhost:8080/usuarios`);
            if (!response.ok) {
                throw new Error('Error al verificar el carrito');
            }
            
            const users = await response.json();
            const currentUser = users.find(user => user.id === userData.id);
            
            if (currentUser?.carrito?.items) {
                return currentUser.carrito.items.some(item => item.menu.id === menuId);
            }
            return false;
        } catch (error) {
            console.error('Error al verificar el carrito:', error);
            return false;
        }
    };

    const addToCart = async (menuId) => {
        console.log('userData en addToCart:', userData);

        if (!userData || !userData.id) {
            console.log('No hay userData o userData.id');
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe iniciar sesión para agregar al carrito',
                life: 3000
            });
            return;
        }

        // Verificar si el producto ya está en el carrito
        const isInCart = await checkIfItemInCart(menuId);
        if (isInCart) {
            toast.current.show({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Este producto ya está en tu carrito',
                life: 3000
            });
            return;
        }

        try {
            const quantity = quantities[menuId] || 1;
            
            console.log('Enviando datos:', {
                usuarioId: userData.id,
                menuId: menuId,
                cantidad: quantity
            });

            const response = await fetch('http://localhost:8080/carrito/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuarioId: userData.id,
                    menuId: menuId,
                    cantidad: quantity
                })
            });

            if (!response.ok) {
                throw new Error('Error al agregar al carrito');
            }

            toast.current.show({
                severity: 'success',
                summary: '¡Éxito!',
                detail: 'Producto agregado al carrito',
                life: 3000
            });

        } catch (error) {
            console.error('Error completo:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo agregar al carrito',
                life: 3000
            });
        }
    };

    const openDialog = (menu) => {
        setSelectedMenu(menu);
        setDialogVisible(true);
    };

    const quantityTemplate = (menuId, currentQuantity, onQuantityChange) => (
        <div className="quantity-controls">
            <Button 
                icon="pi pi-minus" 
                className="p-button-rounded"
                onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(menuId, Math.max(1, currentQuantity - 1));
                }}
                disabled={currentQuantity <= 1}
            />
            <InputNumber 
                value={currentQuantity} 
                onValueChange={(e) => onQuantityChange(menuId, e.value)}
                showButtons={false}
                min={1}
                max={10}
                inputClassName="quantity-input"
                readOnly
            />
            <Button 
                icon="pi pi-plus" 
                className="p-button-rounded"
                onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(menuId, Math.min(10, currentQuantity + 1));
                }}
                disabled={currentQuantity >= 10}
            />
        </div>
    );

    const menuTemplate = (menu) => {
        return (
            <div className="carousel-item" onClick={() => openDialog(menu)}>
                <Card className="menu-card">
                    <img 
                        src={menu.imagen} 
                        alt={menu.nombre} 
                        className="menu-image"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                    />
                    <div className="menu-content">
                        <h3 className="menu-title">{menu.nombre}</h3>
                        <p className="menu-description">{menu.descripcion}</p>
                        <div className="menu-details">
                            <span className="menu-price">${menu.precio.toFixed(2)}</span>
                            <span className="menu-category">
                                {categoryNames[menu.categoria] || menu.categoria}
                            </span>
                        </div>
                        <div className="add-to-cart-section" onClick={e => e.stopPropagation()}>
                            {quantityTemplate(menu.id, quantities[menu.id], handleQuantityChange)}
                            <Button 
                                label="Agregar al Carrito" 
                                icon="pi pi-shopping-cart"
                                onClick={(e) => addToCart(menu.id)}
                                className="add-to-cart-button"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="home-container">
            <Toast ref={toast} />
            <div className="welcome-section">
                <h1>Bienvenidos a Nuestro Restaurante</h1>
                <p>Descubre nuestra selección de platos destacados</p>
            </div>

            <div className="carousel-section">
                <Carousel
                    value={featuredMenus}
                    numVisible={3}
                    numScroll={3}
                    className="custom-carousel"
                    itemTemplate={menuTemplate}
                    autoplayInterval={3000}
                    circular
                    autoplay
                    responsiveOptions={[
                        {
                            breakpoint: '1024px',
                            numVisible: 2,
                            numScroll: 2
                        },
                        {
                            breakpoint: '600px',
                            numVisible: 1,
                            numScroll: 1
                        }
                    ]}
                />
            </div>

            {selectedMenu && (
                <Dialog 
                    visible={dialogVisible} 
                    onHide={() => setDialogVisible(false)}
                    header={selectedMenu.nombre}
                    modal
                    className="menu-dialog"
                    style={{ width: '90%', maxWidth: '800px' }}
                >
                    <div className="menu-dialog-content">
                        <img 
                            src={selectedMenu.imagen} 
                            alt={selectedMenu.nombre} 
                            className="dialog-image"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                        />
                        <div className="dialog-details">
                            <p className="dialog-description">{selectedMenu.descripcion}</p>
                            <div className="dialog-info">
                                <span className="dialog-price">
                                    ${selectedMenu.precio.toFixed(2)}
                                </span>
                                <span className="dialog-category">
                                    {categoryNames[selectedMenu.categoria] || selectedMenu.categoria}
                                </span>
                            </div>
                            <div className="dialog-cart-section">
                                {quantityTemplate(selectedMenu.id, quantities[selectedMenu.id], handleQuantityChange)}
                                <Button 
                                    label="Agregar al Carrito" 
                                    icon="pi pi-shopping-cart"
                                    onClick={(e) => addToCart(selectedMenu.id)}
                                    className="p-button-rounded"
                                />
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
}

export default Home;