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

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      setError('Este correo ya está registrado.');
    } else {
      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-80 bg-indigo-50 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Crear Cuenta</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">Correo Electrónico *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" // Texto negro
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">Contraseña *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black" // Texto negro
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
          >
            Crear Cuenta
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-indigo-500 hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
