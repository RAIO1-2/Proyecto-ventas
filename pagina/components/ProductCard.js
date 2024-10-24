'use client';  // Si estás usando hooks de React

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white">
      <img
        className="w-full"
        src={product.image}
        alt={product.name}
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-black">{product.name}</div>
        <p className="text-black text-base">{product.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="block text-lg font-semibold mb-2 text-black">${product.price}</span>
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
