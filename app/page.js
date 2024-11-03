'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification'; // Import the Notification component

const translations = {
  en: {
    searchPlaceholder: 'Search products...',
    noProductsFound: 'No products found.',
    addedToCart: (productName) => `${productName} added to cart!`,
    addToCart: 'Add to Cart',
  },
  es: {
    searchPlaceholder: 'Buscar productos...',
    noProductsFound: 'No se encontraron productos.',
    addedToCart: (productName) => `${productName} agregado al carrito!`,
    addToCart: 'Agregar al Carrito',
  },
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [language, setLanguage] = useState('en'); // Default language
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const context = require.context('../products', false, /\.json$/);
        const productData = context.keys().map((file) => {
          const product = context(file);
          const filename = file.replace('./', '').replace('.json', '');
          return { ...product, filename };
        });
        setProducts(productData);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false); // Set loading to false after products are loaded
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (product) => {
    const updatedCart = cart.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    );

    if (!cart.find((item) => item.id === product.id)) {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Show notification
    const newNotification = translations[language].addedToCart(product.name);
    const notificationId = Date.now(); // Unique ID for each notification
    setNotifications((prev) => [
      ...prev,
      { id: notificationId, message: newNotification },
    ]);

    // Automatically remove notification after X seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId)); // Remove specific notification
    }, 5000);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <div className="container mx-auto mt-20">
        <input
          type="text"
          placeholder={translations[language].searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded text-black w-full max-w-md"
        />
        <div className="flex flex-wrap justify-between gap-4" style={{ minHeight: '300px' }}>
          {loading ? (
            <p className="text-white">Loading products...</p> // Placeholder while loading
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex-grow">
                <ProductCard
                  product={product}
                  filename={product.filename}
                  addToCart={addToCart}
                  translations={translations[language]} // Pass translations to ProductCard
                />
              </div>
            ))
          ) : (
            <p className="text-white">{translations[language].noProductsFound}</p>
          )}
        </div>
        {/* Render notifications */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              message={notification.message}
              onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))} // Dismiss specific notification
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
