import { useEffect, useState, useRef } from 'react';
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

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
        <div className="p-d-flex p-ai-center">
            <Button
                icon="pi pi-minus"
                className="p-button-rounded p-mr-2"
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
                className="p-button-rounded p-ml-2"
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
            <Card
                className="menu-card p-mr-3 p-shadow-2"
                style={{
                    height: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    maxWidth: '300px',
                    marginRight: '15px',
                    marginLeft: '15px'
                }}
                onClick={() => openDialog(menu)}
            >
                <img
                    src={menu.imagen}
                    alt={menu.nombre}
                    className="menu-image"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300'}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        objectFit: 'cover',
                        flexShrink: 0
                    }}
                />
                <div
                    className="menu-content"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '15px',
                        flexGrow: 1
                    }}
                >
                    <h3
                        className="menu-title"
                        style={{
                            margin: '10px 0',
                            fontSize: '16px'
                        }}
                    >
                        {menu.nombre}
                    </h3>
                    <p
                        className="menu-description"
                        style={{
                            fontSize: '14px',
                            color: '#555',
                            flexGrow: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                        }}
                    >
                        {menu.descripcion}
                    </p>
                    <div
                        className="menu-details"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                        }}
                    >
                        <span
                            className="menu-price"
                            style={{
                                fontSize: '18px',
                                fontWeight: 'bold'
                            }}
                        >
                            ${menu.precio.toFixed(2)}
                        </span>
                        <span
                            className="menu-category"
                            style={{
                                fontSize: '14px',
                                color: '#888'
                            }}
                        >
                            {categoryNames[menu.categoria] || menu.categoria}
                        </span>
                    </div>
                </div>
            </Card>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            size: 'small',
            numScroll: 1
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            size: 'small',
            numScroll: 1
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            size: 'small',
            numScroll: 1
        }
    ];

    return (
        <>
            <Toast ref={toast} />
            <div style={{ marginBottom: '20px' }}>
                <Carousel
                    value={featuredMenus}
                    itemTemplate={menuTemplate}
                    numVisible={3}
                    numScroll={1}
                    responsiveOptions={responsiveOptions}
                    circular
                    autoplay
                    autoplayInterval={3000}
                    style={{
                        marginBottom: '20px',
                    }}
                />
            </div>

            <Dialog
                header="Detalles del plato"
                visible={dialogVisible}
                style={{
                    width: '30vw', // Reduce el ancho del Dialog
                    padding: '15px',
                    borderRadius: '10px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
                onHide={() => setDialogVisible(false)}
                modal
                draggable={false}
                className="p-d-flex p-ai-center"
                baseZIndex={1000}
            >
                <div
                    style={{
                        background: '#fff',
                        borderRadius: '10px',
                        padding: '20px',
                        marginTop: '10px',
                        boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                        textAlign: 'center', // Centra todo el texto y elementos
                        transition: 'all 0.3s ease',
                    }}
                >
                    <img
                        src={selectedMenu?.imagen}
                        alt={selectedMenu?.nombre}
                        className="menu-image"
                        style={{
                            width: '100%',
                            maxHeight: '200px', // Tamaño más pequeño
                            objectFit: 'cover',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            marginBottom: '15px',
                            transition: 'transform 0.3s ease',
                        }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                    <h3
                        style={{
                            fontSize: '20px', // Tamaño más pequeño
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '8px',
                        }}
                    >
                        {selectedMenu?.nombre}
                    </h3>
                    <p
                        style={{
                            fontSize: '14px', // Tamaño más pequeño
                            color: '#555',
                            marginBottom: '12px',
                        }}
                    >
                        {selectedMenu?.descripcion}
                    </p>
                    <p
                        style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#007BFF',
                            marginBottom: '10px',
                        }}
                    >
                        ${selectedMenu?.precio.toFixed(2)}
                    </p>
                    <p
                        style={{
                            fontSize: '14px',
                            color: '#888',
                            fontStyle: 'italic',
                            marginBottom: '20px',
                        }}
                    >
                        {categoryNames[selectedMenu?.categoria]}
                    </p>

                    {selectedMenu && (
                        <div>
                            <p
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginBottom: '10px',
                                }}
                            >
                                <strong>Cantidad:</strong>
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '15px',
                                }}
                            >
                                <Button
                                    icon="pi pi-minus"
                                    className="p-button-rounded p-button-outlined"
                                    style={{
                                        width: '30px',
                                        height: '30px', // Botones más pequeños
                                        padding: '0',
                                        fontSize: '16px',
                                    }}
                                    onClick={() => handleQuantityChange(selectedMenu.id, quantities[selectedMenu.id] - 1)}
                                    disabled={quantities[selectedMenu.id] <= 1}
                                />
                                <span
                                    style={{
                                        fontSize: '16px', // Tamaño más pequeño
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {quantities[selectedMenu.id]}
                                </span>
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-rounded p-button-outlined"
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        padding: '0',
                                        fontSize: '16px',
                                    }}
                                    onClick={() => handleQuantityChange(selectedMenu.id, quantities[selectedMenu.id] + 1)}
                                />
                            </div>
                            <Button
                                label="Agregar al carrito"
                                icon="pi pi-cart-plus"
                                className="p-button-success p-mt-3 p-button-rounded"
                                style={{
                                    width: '70%', // Botón más pequeño
                                    padding: '10px 0',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                }}
                                onClick={() => addToCart(selectedMenu.id)}
                            />
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    );
}

export default Home;
