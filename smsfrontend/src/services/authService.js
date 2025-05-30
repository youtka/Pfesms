// ✅ Updated: src/services/authService.js
import { jwtDecode } from 'jwt-decode';


export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

export async function getCurrentUser() {
  const token = getToken();

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch('http://localhost:9190/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return await response.json();
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

export function getDecodedToken() {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}
