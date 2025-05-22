import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  Avatar,
  Tooltip,
} from 'flowbite-react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { CiLogout, CiExport, CiGrid2H } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setToken } from '../utils/auth/token';
import { useAuth } from '../context/AuthContext';

export default function Header({ onAddImage }: { onAddImage: () => void }) {
  const { isAuthenticated, setAuthenticated } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    setToken('');
    setAuthenticated(false);
  };

  const handleMyImage = () => {
    navigate('/my-images');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Navbar fluid rounded>
      <NavbarBrand className="pl-4">
        <Link to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            SpankMe
          </span>
        </Link>
      </NavbarBrand>

      <NavbarToggle />

      <NavbarCollapse>
        <div onClick={toggleTheme} className="cursor-pointer mr-4">
          {darkMode ? (
            <FaSun className="h-6 w-6 text-yellow-400" />
          ) : (
            <FaMoon className="h-6 w-6 text-gray-600 dark:text-white" />
          )}
        </div>

        {!isAuthenticated ? (
          <NavbarLink>
            <Link to="/login">Connexion</Link>
          </NavbarLink>
        ) : (
          <div className="relative group">
            <Avatar
              alt="Avatar"
              img="https://minio.coak.fr/like-it-pp/f3b5a10aaefdad91fec29ae6dad5ff92.jpg"
              rounded
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 flex flex-col items-end space-y-2 z-50">
                <Tooltip content="Ajouter Image" placement="left">
                  <button
                    onClick={onAddImage}
                    className="flex justify-center items-center w-[40px] h-[40px] hover:text-white bg-white dark:bg-gray-700 hover:bg-gray-500 rounded-full border border-gray-200 dark:border-gray-600 shadow dark:shadow-sm focus:outline-none"
                  >
                    <CiExport className="w-5 h-5" />
                    <span className="sr-only">Ajouter Image</span>
                  </button>
                </Tooltip>

                <Tooltip content="Mes Images" placement="left">
                  <button
                    onClick={handleMyImage}
                    className="flex justify-center items-center w-[40px] h-[40px] hover:text-white bg-white dark:bg-gray-700 hover:bg-gray-500 rounded-full border border-gray-200 dark:border-gray-600 shadow dark:shadow-sm focus:outline-none"
                  >
                    <CiGrid2H className="w-5 h-5" />
                    <span className="sr-only">Mes Images</span>
                  </button>
                </Tooltip>

                <Tooltip content="Déconnexion" placement="left">
                  <button
                    onClick={handleLogout}
                    className="flex justify-center items-center w-[40px] h-[40px] text-red-500 hover:text-white bg-white dark:bg-gray-700 dark:hover:bg-red-600 hover:bg-red-500 rounded-full border border-gray-200 dark:border-gray-600 shadow dark:shadow-sm focus:outline-none"
                  >
                    <CiLogout className="w-5 h-5" />
                    <span className="sr-only">Déconnexion</span>
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
