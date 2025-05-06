import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/auth/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { setToken } from '../utils/auth/token';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 10;
  const isFormValid = isEmailValid && isPasswordValid;
  const { setAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      const token = response.data?.access_token;
      if (token) {
        setToken(token);
        setAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Connexion à la plateforme</h5>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white ${!isEmailValid && email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-500'} focus:ring-blue-500 focus:border-blue-500`}
              placeholder="name@company.com"
            />
            {!isEmailValid && email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">Adresse email invalide.</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`bg-gray-50 border text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white ${!isPasswordValid && password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-500'} focus:ring-blue-500 focus:border-blue-500`}
            />
            {!isPasswordValid && password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">Le mot de passe doit contenir au moins 10 caractères.</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center h-5">
              <input id="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
              <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Se souvenir de moi</label>
            </div>
            <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500"> <Link to="https://minio.coak.fr/like-it-pp/kermit-not-my-problem.gif"> Mot de passe oublié ? </Link></a>
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Se connecter
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Pas encore de compte ? <Link to="/register" className="text-blue-700 hover:underline dark:text-blue-500">Créer un compte</Link>
          </div>
        </form>
      </div>
    </div>
  );
}