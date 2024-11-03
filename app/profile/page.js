'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    adjustProfile: 'Adjust Profile',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    address: 'Address',
    profilePicture: 'Profile Picture',
    updateProfile: 'Update Profile',
    loading: 'Loading...',
    profileNotFound: 'Profile not found. Please log in.',
  },
  es: {
    adjustProfile: 'Ajustar Perfil',
    username: 'Nombre de Usuario',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    address: 'Dirección',
    profilePicture: 'Foto de Perfil',
    updateProfile: 'Actualizar Perfil',
    loading: 'Cargando...',
    profileNotFound: 'Perfil no encontrado. Por favor inicie sesión.',
  },
};

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [language, setLanguage] = useState('en'); // Default language
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser(loggedInUser);
      setAuthenticated(true);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert(translations[language].profileUpdated);
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile. Please try again.');
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: reader.result || ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading indicator if still loading
  if (loading) {
    return <div className="text-center py-8">{translations[language].loading}</div>;
  }

  // If not authenticated, show a message or redirect
  if (!authenticated) {
    return (
      <div className="text-center py-8">
        <h2>{translations[language].profileNotFound}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 pt-20"> {/* Added pt-20 for padding-top */}
      <h1 className="text-3xl font-bold mb-4">{translations[language].adjustProfile}</h1>
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">{translations[language].username}</label>
          <input
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">{translations[language].email}</label>
          <input
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">{translations[language].password}</label>
          <input
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2">{translations[language].address}</label>
          <input
            id="address"
            type="text"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="profilePicture" className="block mb-2">{translations[language].profilePicture}</label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="border p-2 w-full"
          />
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Profile Picture"
              className="mt-4 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">
          {translations[language].updateProfile}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
