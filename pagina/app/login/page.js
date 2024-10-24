'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (event) => {
    event.preventDefault();

    // Obtener los usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar si el usuario existe y las credenciales coinciden
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      // Guardar al usuario logueado en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      
      // Redirigir a la página de productos si el login es exitoso
      router.push('/products');
    } else {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full text-black"  // Aquí añadimos "text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full text-black"  // Aquí añadimos "text-black"
            required
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">Iniciar Sesión</button>
      </form>

      <p className="mt-4">
        ¿No tienes cuenta? <a href="/register" className="text-blue-500">Crear una cuenta</a>
      </p>
    </div>
  );
};

export default LoginPage;
