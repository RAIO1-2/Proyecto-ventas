'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para la autenticación
  const [profilePicture, setProfilePicture] = useState(null); // Estado para la imagen de perfil
  const router = useRouter();

  // Función que comprueba si el usuario está logueado
  const checkIfUserIsLoggedIn = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      if (user.profilePicture) {
        setProfilePicture(user.profilePicture);
      }
    }
  };

  // Ejecutamos la comprobación de sesión cuando el componente se monta
  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  // Manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Eliminar el usuario del localStorage
    setIsLoggedIn(false); // Cambiar el estado
    setProfilePicture(null); // Eliminar la imagen de perfil
    router.push('/'); // Redirigir a la página principal
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-end items-center">
        <ul className="flex space-x-4 items-center">
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

          {/* Mostrar Iniciar Sesión y Crear Cuenta si no está logueado */}
          {!isLoggedIn && (
            <>
              <li>
                <Link href="/login" className="text-white hover:text-gray-300">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-white hover:text-gray-300">
                  Crear Cuenta
                </Link>
              </li>
            </>
          )}

          {/* Mostrar el perfil y opciones si está logueado */}
          {isLoggedIn && (
            <li className="relative group flex items-center">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Foto de perfil"
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div> // Icono vacío si no hay imagen
              )}
              <button className="text-white hover:text-gray-300">
                Perfil
              </button>
              <ul className="absolute right-0 mt-10 bg-gray-800 text-white rounded-lg shadow-lg hidden group-hover:block group-focus-within:block z-10">
                <li>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700">
                    Ajustar Perfil
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
