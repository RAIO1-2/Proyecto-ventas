'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = (event) => {
    event.preventDefault();

    // Obtener los usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Verificar si el correo ya está registrado
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      setError('Este correo ya está registrado.');
    } else {
      // Crear el nuevo usuario y guardarlo en el localStorage
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Redirigir al login
      router.push('/login');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Crear Cuenta</h1>
      <form onSubmit={handleRegister}>
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

        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">Crear Cuenta</button>
      </form>

      <p className="mt-4">
        ¿Ya tienes cuenta? <a href="/login" className="text-blue-500">Iniciar sesión</a>
      </p>
    </div>
  );
};

export default RegisterPage;
