import { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import url_Backend from './config';

function Menu({ userData }) {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = useRef(null);

    const categoryNames = {
        'PLATOS_ESPECIALES': 'Platos Especiales',
        'COMIDAS_RAPIDAS': 'Comidas Rápidas',
        'BOCADITOS': 'Bocaditos'
    };

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await fetch(`http://${url_Backend}:8080/menu`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const initialQuantities = {};
                    data.forEach(menu => {
                        initialQuantities[menu.id] = 1;
                    });
                    setQuantities(initialQuantities);
                    setMenus(data);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    const openDialog = (menu) => {
        setSelectedMenu(menu);
        setDialogVisible(true);
    };

    // Agrupar menús por categoría
    const menusByCategory = menus.reduce((acc, menu) => {
        const category = menu.categoria;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(menu);
        return acc;
    }, {});

    // Función para cambiar la cantidad
    const handleQuantityChange = (menuId, newQuantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [menuId]: Math.max(1, newQuantity), // Evita que la cantidad sea menor que 1
        }));
    };

    // Función para agregar al carrito
    const addToCart = async (menuId) => {
        const quantity = quantities[menuId];
        const menuItem = menus.find((menu) => menu.id === menuId);

        if (!menuItem || !quantity) return;

        try {
            const response = await fetch(`http://${url_Backend}:8080/carrito/agregar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuarioId: userData.id, // Suponiendo que tienes el ID del usuario en `userData`
                    menuId: menuItem.id,
                    cantidad: quantity,
                }),
            });

            if (response.ok) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `${menuItem.nombre} agregado al carrito`,
                    life: 3000,
                });
                setDialogVisible(false); // Cierra el diálogo después de agregar al carrito
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo agregar al carrito',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un problema al agregar al carrito',
                life: 3000,
            });
        }
    };

    if (loading) {
        return <div className="loading-spinner">Cargando...</div>;
    }

    return (
        <div className="menu-container">
            <Toast ref={toast} />
            <h1 className="menu-page-title">Nuestro Menú</h1>

            {Object.entries(menusByCategory).map(([category, items], index) => (
                <div key={category} className="category-section">
                    <h2 className="category-title">
                        {categoryNames[category] || category}
                    </h2>

                    {index > 0 && <hr className="category-divider" />}

                    <div className="menu-grid" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '20px'
                    }}>
                        {items.map(menu => (
                            <Card
                                key={menu.id}
                                className="menu-card"
                                style={{
                                    height: '450px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    maxWidth: '300px',
                                    margin: '10px',
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
                        ))}
                    </div>
                </div>
            ))}

            <Dialog
                header="Detalles del plato"
                visible={dialogVisible}
                style={{
                    width: '30vw',
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
                        textAlign: 'center',
                    }}
                >
                    <img
                        src={selectedMenu?.imagen}
                        alt={selectedMenu?.nombre}
                        className="menu-image"
                        style={{
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                            marginBottom: '15px',
                        }}
                    />
                    <h3
                        style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#333',
                            marginBottom: '8px',
                        }}
                    >
                        {selectedMenu?.nombre}
                    </h3>
                    <p
                        style={{
                            fontSize: '14px',
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
                            <Button
                                icon="pi pi-minus"
                                onClick={() =>
                                    handleQuantityChange(
                                        selectedMenu.id,
                                        quantities[selectedMenu.id] - 1
                                    )
                                }
                                style={{ marginRight: '10px' }}
                            />
                            <span>{quantities[selectedMenu.id]}</span>
                            <Button
                                icon="pi pi-plus"
                                onClick={() =>
                                    handleQuantityChange(
                                        selectedMenu.id,
                                        quantities[selectedMenu.id] + 1
                                    )
                                }
                                style={{ marginLeft: '10px' }}
                            />
                            <div style={{ marginTop: '20px' }}>
                                <Button
                                    label="Agregar al carrito"
                                    icon="pi pi-shopping-cart"
                                    onClick={() => addToCart(selectedMenu.id)}
                                    style={{ width: '100%' }}
                                    className="p-button-success"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}

export default Menu;
