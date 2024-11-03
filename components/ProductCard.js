'use client';

import React from 'react';
import './design/book.css';

const translations = {
  en: {
    buttonText: 'Add to Cart',
  },
  es: {
    buttonText: 'Agregar al carrito',
  },
};

const ProductCard = ({ product, filename, addToCart, language }) => {
  // Get button text for the current language
  const buttonText = translations[language]?.buttonText || translations.en.buttonText;

  return (
    <div className="book">
      <div className="book-content">
        <div className="text-content">
          <h2 className="font-bold text-xl mb-2">{product.name}</h2>
          <p className="text-base">
            {product.description[language] || product.description.en} {/* Use product description based on language */}
          </p>
          <span className="block text-lg font-semibold mb-2">${product.price}</span>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {buttonText}
        </button>
      </div>
      <div className="cover">
        <div className="cover-title">
          <h3>{product.name}</h3>
        </div>
        <img src={`/products/${filename}.png`} alt={product.name} className="cover-image" />
      </div>
    </div>
  );
};

export default ProductCard;
