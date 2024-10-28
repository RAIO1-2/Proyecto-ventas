'use client'; // Si estás usando hooks de React

import React from 'react';
import './design/book.css'; // Importamos el archivo CSS de diseño

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="book">
      {/* Contenido del libro */}
      <div className="book-content">
        <div className="text-content">
          <h2 className="font-bold text-xl mb-2">{product.name}</h2>
          <p className="text-base">{product.description}</p>
          <span className="block text-lg font-semibold mb-2">${product.price}</span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar al carrito
        </button>
      </div>

      {/* Cubierta del libro con el nombre del producto y una imagen */}
      <div className="cover">
        <div className="cover-title">
          <h3>{product.name}</h3>
        </div>
        <img src={product.image} alt={product.name} className="cover-image" />
      </div>
    </div>
  );
};

export default ProductCard;
