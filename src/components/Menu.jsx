import MenuItem from './MenuItem'

function Menu({ menuItems, onAddToCart }) {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Nuestro Menú</h1>
        <p>Descubre nuestra selección de platillos</p>
      </header>

      <div className="page-content">
        <section className="menu-section">
          <h2 className="menu-title">Entradas</h2>
          <div className="menu-grid">
            {menuItems.entradas.map(item => (
              <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        <section className="menu-section">
          <h2 className="menu-title">Platos Principales</h2>
          <div className="menu-grid">
            {menuItems.platosPrincipales.map(item => (
              <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>

        <section className="menu-section">
          <h2 className="menu-title">Postres</h2>
          <div className="menu-grid">
            {menuItems.postres.map(item => (
              <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Menu 