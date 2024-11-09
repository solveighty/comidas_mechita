import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"
import MenuItem from './MenuItem'

function Home({ menuItems, onAddToCart }) {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Restaurante Gourmet</h1>
        <p>Experiencia culinaria única</p>
      </header>

      <div className="page-content">
        <div className="carousel-container">
          <Carousel 
            autoPlay 
            infiniteLoop 
            showStatus={false}
            showThumbs={false}
            interval={3000}
          >
            <div className="carousel-slide">
              <h3>Entradas</h3>
              <div className="menu-grid">
                {menuItems.entradas.map(item => (
                  <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
                ))}
              </div>
            </div>
            <div className="carousel-slide">
              <h3>Platos Principales</h3>
              <div className="menu-grid">
                {menuItems.platosPrincipales.map(item => (
                  <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
                ))}
              </div>
            </div>
            <div className="carousel-slide">
              <h3>Postres</h3>
              <div className="menu-grid">
                {menuItems.postres.map(item => (
                  <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
                ))}
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default Home 