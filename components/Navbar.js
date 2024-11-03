'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    store: 'Store',
    about: 'About',
    cart: 'Cart',
    login: 'Log In',
    profile: 'Profile',
    adjustProfile: 'Adjust Profile',
    logout: 'Logout',
    language: 'Language',
  },
  es: {
    store: 'Tienda',
    about: 'Acerca de',
    cart: 'Carrito',
    login: 'Iniciar Sesión',
    profile: 'Perfil',
    adjustProfile: 'Ajustar Perfil',
    logout: 'Logout',
    language: 'Idioma',
  },
};

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // State for profile dropdown visibility
  const [loading, setLoading] = useState(true); // New loading state
  const router = useRouter();
  const dropdownRef = useRef(null); // Ref for the language dropdown
  const profileDropdownRef = useRef(null); // Ref for the profile dropdown

  const checkIfUserIsLoggedIn = () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      if (user.profilePicture) {
        setProfilePicture(user.profilePicture);
      }
    }
    setLoading(false); // Set loading to false after checking
  };

  useEffect(() => {
    // Check if a language is stored in localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    checkIfUserIsLoggedIn();
  }, []);

  useEffect(() => {
    // Close dropdowns if clicking outside of them
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setProfilePicture(null);
    router.push('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // Save selected language to localStorage
    setDropdownOpen(false); // Close dropdown after selection
    window.location.reload(); // This refreshes the current page
  };

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full z-50" style={{ height: '60px' }}>
      <div className="container mx-auto flex justify-between items-center h-full">
        {/* Loading state check */}
        {loading ? (
          <div className="text-white">Loading...</div> // Placeholder while loading
        ) : (
          <>
            {/* Left-aligned links */}
            <ul className="flex space-x-4 items-center">
              <li>
                <Link href="/" className="text-white hover:text-gray-300" onClick={() => setDropdownOpen(false)}>
                  {translations[language].store}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:text-gray-300" onClick={() => setDropdownOpen(false)}>
                  {translations[language].about}
                </Link>
              </li>

              {/* Language Dropdown */}
              <li className="relative" ref={dropdownRef}>
                <button onClick={toggleDropdown} className="text-white hover:text-gray-300">
                  {translations[language].language}
                </button>
                {dropdownOpen && (
                  <ul className="absolute left-0 mt-1 bg-gray-800 text-white rounded-lg shadow-lg z-10">
                    <li>
                      <button
                        onClick={() => selectLanguage('en')}
                        className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                      >
                        English
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => selectLanguage('es')}
                        className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                      >
                        Español
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </ul>

            {/* Right-aligned links */}
            <ul className="flex space-x-4 items-center">
              <li>
                <Link href="/cart" className="text-white hover:text-gray-300" onClick={() => setDropdownOpen(false)}>
                  {translations[language].cart}
                </Link>
              </li>

              {/* Show login if not logged in */}
              {!isLoggedIn && (
                <li>
                  <Link href="/login" className="text-white hover:text-gray-300" onClick={() => setDropdownOpen(false)}>
                    {translations[language].login}
                  </Link>
                </li>
              )}

              {/* Show profile and logout options if logged in */}
              {isLoggedIn && (
                <li className="relative group flex items-center" ref={profileDropdownRef}>
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile Picture"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-400 rounded-full mr-2"></div>
                  )}
                  <button onClick={toggleProfileDropdown} className="text-white hover:text-gray-300">
                    {translations[language].profile}
                  </button>
                  {profileDropdownOpen && (
                    <ul className="absolute right-0 mt-40 bg-gray-800 text-white rounded-lg shadow-lg z-10">
                      <li>
                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-700" onClick={() => setProfileDropdownOpen(false)}>
                          {translations[language].adjustProfile}
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                        >
                          {translations[language].logout}
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              )}
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
