'use client';

import { useState, useEffect, useCallback } from 'react';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en'); // Default language

  // Traducciones
  const translations = {
    en: {
      cartTitle: 'Shopping Cart',
      unitPrice: 'Unit Price',
      totalForProduct: 'Total per Product',
      totalSale: 'Total Sale',
      remove: 'Remove',
      emptyCart: 'Your cart is empty.',
      removedFromCart: 'removed from cart!',
      updateError: 'Error updating the cart.',
    },
    es: {
      cartTitle: 'Carrito de Compras',
      unitPrice: 'Precio Unitario',
      totalForProduct: 'Total por Producto',
      totalSale: 'Total de la Venta',
      remove: 'Eliminar',
      emptyCart: 'Tu carrito está vacío.',
      removedFromCart: 'eliminado del carrito!',
      updateError: 'Error al actualizar el carrito.',
    },
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Actualizar carrito y localStorage
  const updateCart = useCallback((updatedCart) => {
    try {
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch {
      setError(translations[language].updateError);
    }
  }, [language, translations]);

  // Modificar cantidad de productos en el carrito
  const modifyQuantity = (productId, change) => {
    const updatedCart = cart
      .map((product) => {
        if (product.id === productId) {
          const newQuantity = product.quantity + change;
          return { ...product, quantity: Math.max(1, newQuantity) }; // Evitar cantidades menores a 1
        }
        return product;
      })
      .filter((product) => product.quantity > 0); // Eliminar productos con cantidad 0
    updateCart(updatedCart);
  };

  // Mostrar notificación
  const showNotification = (message) => {
    const notificationId = Date.now(); // ID único
    setNotifications((prev) => [...prev, { id: notificationId, message }]);

    // Eliminar notificación después de 5 segundos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    }, 5000);
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    try {
      const productToRemove = cart.find((product) => product.id === productId);
      if (productToRemove) {
        const updatedCart = cart.filter((product) => product.id !== productId);
        updateCart(updatedCart);
        showNotification(`${productToRemove.name} ${translations[language].removedFromCart}`);
      }
    } catch {
      setError(translations[language].updateError);
    }
  };

  // Calcular total de la venta
  const totalVenta = cart.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold my-4 text-left">{translations[language].cartTitle}</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {cart.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {cart.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center border p-4 bg-gray-800 rounded-lg"
              >
                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p className="text-gray-300">
                    {translations[language].unitPrice}: ${product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-300">
                    {translations[language].totalForProduct}:{' '}
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => modifyQuantity(product.id, -1)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={product.quantity === 1} // Desactivar si la cantidad es 1
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
            <div className="border-t mt-4 pt-4 text-center">
              <h2 className="text-xl font-bold">
                {translations[language].totalSale}: ${totalVenta.toFixed(2)}
              </h2>
            </div>
          </div>
        ) : (
          <p className="text-center text-white">{translations[language].emptyCart}</p>
        )}

        {/* Renderizar notificaciones */}
        <div className="fixed bottom-4 right-4 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-red-600 text-white p-2 rounded shadow-lg"
            >
              {notification.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
