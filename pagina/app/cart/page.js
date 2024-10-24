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

  // Calcular el total de la venta (suma de todos los productos)
  const totalVenta = cart.reduce(
    (total, product) => total + product.price * product.quantity, 0
  );

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Carrito de compras</h1>

      {cart.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {cart.map((product) => (
            <div key={product.id} className="flex justify-between items-center border p-4">
              <div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p>Cantidad: {product.quantity}</p>
                <p>Precio unitario: ${product.price.toFixed(2)}</p>
                <p>Total por producto: ${(product.price * product.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}

          {/* Mostrar el total de la venta */}
          <div className="border-t mt-4 pt-4">
            <h2 className="text-xl font-bold">Total de la venta: ${totalVenta.toFixed(2)}</h2>
          </div>
        </div>
      ) : (
        <p>Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default CartPage;
