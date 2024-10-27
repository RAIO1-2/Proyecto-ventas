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

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.email === email && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      router.push('/products');
    } else {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-80 bg-indigo-50 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">Hola de nuevo!</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">Correo *</label>
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
            Ingresar
          </button>
        </form>

        <a href="#" className="block text-center text-xs text-indigo-500 mt-4 hover:underline">
          ¿Olvidó la contraseña?
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
