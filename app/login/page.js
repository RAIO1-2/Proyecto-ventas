'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    title: 'Welcome Back!',
    email: 'Email Address *',
    password: 'Password *',
    forgotPassword: 'Forgot password?',
    login: 'Login',
    createAccount: 'Don’t have an account?',
    createAccount2: 'Create one',
    loginError: 'Incorrect email or password.',
  },
  es: {
    title: '¡Hola de nuevo!',
    email: 'Correo Electrónico *',
    password: 'Contraseña *',
    forgotPassword: '¿Olvidó la contraseña?',
    login: 'Ingresar',
    createAccount: '¿No tienes una cuenta?',
    createAccount2: 'Crear cuenta',
    loginError: 'Email o contraseña incorrectos.',
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en'); // Default language
  const router = useRouter();

  useEffect(() => {
    // Check if a language is stored in localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(translations[language].loginError);
      }

      const user = await response.json();
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      router.push('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-80 bg-indigo-50 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">{translations[language].title}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">{translations[language].email}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">{translations[language].password}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            />
            <a href="#" className="block text-xs text-indigo-500 hover:underline text-right mt-2">{translations[language].forgotPassword}</a>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
          >
            {translations[language].login}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-4">{translations[language].createAccount} <a href="/register" className="text-indigo-500 hover:underline">{translations[language].createAccount2}</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
