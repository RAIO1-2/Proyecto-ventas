'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification';

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
  const [notifications, setNotifications] = useState([]);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Listen for language changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'language') {
        setLanguage(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Clean up the listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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

    const newNotification = translations[language].addedToCart(product.name);
    const notificationId = Date.now();
    setNotifications((prev) => [
      ...prev,
      { id: notificationId, message: newNotification },
    ]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
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
            <p className="text-white">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex-grow">
                <ProductCard
                  product={product}
                  filename={product.filename}
                  addToCart={addToCart}
                  language={language}
                />
              </div>
            ))
          ) : (
            <p className="text-white">{translations[language].noProductsFound}</p>
          )}
        </div>
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              message={notification.message}
              onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
