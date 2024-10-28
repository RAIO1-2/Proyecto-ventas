'use client';

import { useState, useEffect } from 'react';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  // Cargar los productos del carrito desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Actualizar el carrito en localStorage
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Función para aumentar la cantidad del producto
  const increaseQuantity = (productId) => {
    const updatedCart = cart.map((product) =>
      product.id === productId
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );
    updateCart(updatedCart);
  };

  // Función para disminuir la cantidad del producto
  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map((product) =>
      product.id === productId && product.quantity > 1
        ? { ...product, quantity: product.quantity - 1 }
        : product
    );
    updateCart(updatedCart);
  };

  // Función para eliminar el producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((product) => product.id !== productId);
    updateCart(updatedCart);
  };

  // Calcular el total de la venta (suma de todos los productos)
  const totalVenta = cart.reduce(
    (total, product) => total + product.price * product.quantity, 0
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold my-4 text-center">Carrito de compras</h1>

        {cart.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {cart.map((product) => (
              <div key={product.id} className="flex justify-between items-center border p-4 bg-gray-800 rounded-lg text-white">
                <div>
                  <h2 className="text-xl font-bold">{product.name}</h2>
                  <p>Precio unitario: ${product.price.toFixed(2)}</p>
                  <p>Total por producto: ${(product.price * product.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Botón para disminuir la cantidad */}
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    disabled={product.quantity === 1} // Deshabilitar si la cantidad es 1
                  >
                    -
                  </button>

                  {/* Cantidad del producto */}
                  <span className="text-white">{product.quantity}</span>

                  {/* Botón para aumentar la cantidad */}
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>

                  {/* Botón para eliminar el producto */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* Mostrar el total de la venta */}
            <div className="border-t mt-4 pt-4">
              <h2 className="text-xl font-bold text-center">Total de la venta: ${totalVenta.toFixed(2)}</h2>
            </div>
          </div>
        ) : (
          <p className="text-center">Tu carrito está vacío.</p>
        )}
      </div>
    </div>
  );
};

export default CartPage;
