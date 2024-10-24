import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-end">
        <ul className="flex space-x-4">
          <li>
            <Link href="/products" className="text-white hover:text-gray-300">
              Productos
            </Link>
          </li>
          <li>
            <Link href="/cart" className="text-white hover:text-gray-300">
              Carrito
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-white hover:text-gray-300">
              Acerca de
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
