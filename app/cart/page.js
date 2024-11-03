'use client';

import { useState, useEffect, useCallback } from 'react';
import Notification from '../../components/Notification'; // Import the Notification component

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [language, setLanguage] = useState('en'); // Default language

  // Define translations
  const translations = {
    en: {
      cartTitle: 'Shopping Cart',
      unitPrice: 'Unit Price',
      totalForProduct: 'Total per Product',
      totalSale: 'Total Sale',
      remove: 'Remove',
      emptyCart: 'Your cart is empty.',
      removedFromCart: 'removed from cart!',
    },
    es: {
      cartTitle: 'Carrito de compras',
      unitPrice: 'Precio unitario',
      totalForProduct: 'Total por producto',
      totalSale: 'Total de la venta',
      remove: 'Eliminar',
      emptyCart: 'Tu carrito está vacío.',
      removedFromCart: 'eliminado del carrito!',
    },
  };

  // Load language setting from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update cart and localStorage
  const updateCart = useCallback((updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }, []);

  // Modify product quantity in cart
  const modifyQuantity = (productId, change) => {
    const updatedCart = cart
      .map((product) => {
        if (product.id === productId) {
          const newQuantity = product.quantity + change;
          return { ...product, quantity: Math.max(1, newQuantity) }; // Ensure quantity doesn't go below 1
        }
        return product;
      })
      .filter((product) => product.quantity > 0); // Remove products with quantity 0
    updateCart(updatedCart);
  };

  // Show notification
  const showNotification = (message) => {
    const notificationId = Date.now(); // Unique ID for each notification
    setNotifications((prev) => [...prev, { id: notificationId, message }]);

    // Automatically remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, 5000);
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    const productToRemove = cart.find((product) => product.id === productId);
    if (productToRemove) {
      const updatedCart = cart.filter((product) => product.id !== productId);
      updateCart(updatedCart);
      showNotification(`${productToRemove.name} ${translations[language].removedFromCart}`);
    }
  };

  // Calculate total sale amount
  const totalVenta = cart.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold my-4 text-left">{translations[language].cartTitle}</h1>

        {cart.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {cart.map((product) => (
              <div key={product.id} className="flex justify-between items-center border p-4 bg-gray-800 rounded-lg">
                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="text-gray-300">
                    {translations[language].unitPrice}: ${product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-300">
                    {translations[language].totalForProduct}: ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => modifyQuantity(product.id, -1)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={product.quantity === 1} // Disable if quantity is 1
                  >
                    -
                  </button>
                  <span className="text-white">{product.quantity}</span>
                  <button
                    onClick={() => modifyQuantity(product.id, 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="bg-red-700 text-white px-2 py-1 rounded"
                  >
                    {translations[language].remove}
                  </button>
                </div>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <h2 className="text-xl font-bold text-right">
                {translations[language].totalSale}: ${totalVenta.toFixed(2)}
              </h2>
            </div>
          </div>
        ) : (
          <p className="text-center text-white">{translations[language].emptyCart}</p>
        )}
        
        {/* Render notifications */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              message={notification.message}
              onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id))} // Dismiss specific notification
              className="bg-red-600" // Add red background specifically for cart notifications
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
