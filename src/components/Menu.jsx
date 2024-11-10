import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import './Menu.css';

function Menu() {
    const [menus, setMenus] = useState([]);
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
                    // Inicializar cantidades
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

    const handleQuantityChange = (menuId, value) => {
        setQuantities(prev => ({
            ...prev,
            [menuId]: value
        }));
    };

    const handleAddToCart = (menu) => {
        const quantity = quantities[menu.id];
        console.log(`Agregando al carrito: ${menu.nombre}, Cantidad: ${quantity}`);
    };

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

    const renderMenuItem = (menu) => (
        <div className="menu-item" key={menu.id}>
            <Card className="menu-card" onClick={() => openDialog(menu)}>
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
                        <div className="quantity-controls">
                            <Button 
                                icon="pi pi-minus" 
                                className="p-button-rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(menu.id, Math.max(1, quantities[menu.id] - 1));
                                }}
                                disabled={quantities[menu.id] <= 1}
                            />
                            <InputNumber 
                                value={quantities[menu.id]} 
                                onValueChange={(e) => handleQuantityChange(menu.id, e.value)}
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
                                    handleQuantityChange(menu.id, Math.min(10, quantities[menu.id] + 1));
                                }}
                                disabled={quantities[menu.id] >= 10}
                            />
                        </div>
                        <Button 
                            label="Agregar al Carrito" 
                            icon="pi pi-shopping-cart"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(menu);
                            }}
                            className="add-to-cart-button"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );

    if (loading) {
        return <div className="loading-spinner">Cargando...</div>;
    }

    return (
        <div className="menu-container">
            <h1 className="menu-page-title">Nuestro Menú</h1>
            
            {Object.entries(menusByCategory).map(([category, items]) => (
                <div key={category} className="category-section">
                    <h2 className="category-title">
                        {categoryNames[category] || category}
                    </h2>
                    <div className="menu-grid">
                        {items.map(menu => renderMenuItem(menu))}
                    </div>
                </div>
            ))}

            <Dialog 
                visible={dialogVisible} 
                onHide={() => setDialogVisible(false)}
                header={selectedMenu?.nombre}
                modal
                className="menu-dialog"
                style={{ width: '90%', maxWidth: '800px' }}
            >
                {selectedMenu && (
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
                                <div className="quantity-controls">
                                    <Button 
                                        icon="pi pi-minus" 
                                        className="p-button-rounded"
                                        onClick={() => handleQuantityChange(
                                            selectedMenu.id, 
                                            Math.max(1, quantities[selectedMenu.id] - 1)
                                        )}
                                        disabled={quantities[selectedMenu.id] <= 1}
                                    />
                                    <InputNumber 
                                        value={quantities[selectedMenu.id]} 
                                        onValueChange={(e) => handleQuantityChange(selectedMenu.id, e.value)}
                                        showButtons={false}
                                        min={1}
                                        max={10}
                                        readOnly
                                    />
                                    <Button 
                                        icon="pi pi-plus" 
                                        className="p-button-rounded"
                                        onClick={() => handleQuantityChange(
                                            selectedMenu.id, 
                                            Math.min(10, quantities[selectedMenu.id] + 1)
                                        )}
                                        disabled={quantities[selectedMenu.id] >= 10}
                                    />
                                </div>
                                <Button 
                                    label="Agregar al Carrito" 
                                    icon="pi pi-shopping-cart"
                                    onClick={() => handleAddToCart(selectedMenu)}
                                    className="add-to-cart-button"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}

export default Menu;