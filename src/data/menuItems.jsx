import React from 'react'

export const menuItems = {
  entradas: [
    {
      id: 1,
      name: "Guacamole Fresco",
      description: "Aguacate fresco con tomate, cebolla y cilantro",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9"
    },
    {
      id: 2,
      name: "Nachos Supremos",
      description: "Totopos con queso fundido, frijoles y jalapeños",
      price: 10.99,
      image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d"
    }
  ],
  platosPrincipales: [
    {
      id: 3,
      name: "Paella de Mariscos",
      description: "Arroz con mariscos variados y azafrán",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a"
    },
    {
      id: 4,
      name: "Filete Mignon",
      description: "Corte premium con salsa de champiñones",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d"
    }
  ],
  postres: [
    {
      id: 5,
      name: "Tiramisú",
      description: "Postre italiano tradicional con café y mascarpone",
      price: 7.99,
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9"
    },
    {
      id: 6,
      name: "Crème Brûlée",
      description: "Natilla francesa con costra de azúcar caramelizada",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc"
    }
  ]
}

// Podemos agregar componentes relacionados con el menú aquí si es necesario
export const MenuContext = React.createContext(menuItems)

export default menuItems 