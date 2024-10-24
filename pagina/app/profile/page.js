'use client';

import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
    profilePicture: '' // Aseguramos que no sea undefined
  });

  // Cargar el usuario logueado al montar el componente
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setUser({
        username: loggedInUser.username || '',  // Default a empty string if undefined
        email: loggedInUser.email || '',
        password: loggedInUser.password || '',
        address: loggedInUser.address || '',
        profilePicture: loggedInUser.profilePicture || ''  // Siempre aseguramos que no sea undefined
      });
    }
  }, []);

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    // Guardar los cambios en localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Perfil actualizado!');
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: reader.result || '' // Nos aseguramos de que siempre haya un valor, aunque sea vacío
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Ajustar Perfil</h1>
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Nombre de Usuario</label>
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
          <label htmlFor="email" className="block mb-2">Correo Electrónico</label>
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
          <label htmlFor="password" className="block mb-2">Contraseña</label>
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
          <label htmlFor="address" className="block mb-2">Dirección</label>
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
          <label htmlFor="profilePicture" className="block mb-2">Foto de Perfil</label>
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
              alt="Foto de perfil"
              className="mt-4 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
