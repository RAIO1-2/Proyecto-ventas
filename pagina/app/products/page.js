'use client';  // Para habilitar el uso de hooks en Next.js

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';  // Importamos desde components/
import products from '../data/products';  // Importamos los productos

const ProductsPage = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // Estado para la búsqueda

  // Cargar el carrito desde localStorage al cargar la página
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);
      if (productExists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Actualizar el carrito en localStorage
    const updatedCart = cart.find((item) => item.id === product.id)
      ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { ...product, quantity: 1 }];
      
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtramos los productos según el término de búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold my-4">Lista de Productos</h1>

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
          className="mb-4 p-2 border border-gray-300 rounded text-black"
        />

        <div className="flex flex-wrap justify-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
