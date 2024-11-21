'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    title: 'Register Account',
    email: 'Email Address *',
    password: 'Password *',
    confirmPassword: 'Confirm Password *',
    registerError: 'User already exists.',
    passwordsDoNotMatch: 'Passwords do not match.',
    invalidEmail: 'Invalid email format.',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    alreadyHaveAccount2: 'Log in',
  },
  es: {
    title: 'Registrar Cuenta',
    email: 'Correo Electrónico *',
    password: 'Contraseña *',
    confirmPassword: 'Confirmar Contraseña *',
    registerError: 'El usuario ya existe.',
    passwordsDoNotMatch: 'Las contraseñas no coinciden.',
    invalidEmail: 'Formato de correo electrónico inválido.',
    createAccount: 'Crear Cuenta',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
    alreadyHaveAccount2: 'Iniciar sesión',
  },
};

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError(translations[language].invalidEmail);
      return;
    }

    if (password !== confirmPassword) {
      setError(translations[language].passwordsDoNotMatch);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(translations[language].registerError);
      }

      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-80 bg-indigo-50 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          {translations[language].title}
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
              {translations[language].email}
            </label>
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
            <label htmlFor="password" className="block font-semibold text-gray-700 mb-1">
              {translations[language].password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-700 mb-1">
              {translations[language].confirmPassword}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
          >
            {translations[language].createAccount}
          </button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-4">
          {translations[language].alreadyHaveAccount}{' '}
          <a href="/login" className="text-indigo-500 hover:underline">
            {translations[language].alreadyHaveAccount2}
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
