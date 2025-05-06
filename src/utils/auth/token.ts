import Cookies from 'js-cookie';
import axiosInstance from './axiosInstance';

const TOKEN_KEY = 'access_token';

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
}

export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}

export function attachTokenToAxios(onUnauthorized: () => void) {
  axiosInstance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        removeToken(); 
        onUnauthorized(); 
      }
      return Promise.reject(error);
    }
  );
}
