import { ShoppingBagIcon, PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/solid'

function Cart({ items, onUpdateQuantity, onRemoveItem }) {
  // Agrupar items iguales y contar cantidades
  const groupedItems = items.reduce((acc, item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, []);

  const total = groupedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Tu Carrito</h1>
        <p>{items.length} items en tu carrito</p>
      </header>

      <div className="page-content">
        <div className="cart-container">
          {items.length === 0 ? (
            <div className="construction-container">
              <ShoppingBagIcon className="construction-icon" />
              <h2>Tu carrito está vacío</h2>
              <p>¡Agrega algunos platillos deliciosos!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {groupedItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="price">${item.price}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="quantity-button"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="quantity-button"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="remove-button"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="cart-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>Total: ${total.toFixed(2)}</h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart