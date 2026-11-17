import apiClient from './client';

/**
 * Login with email and password
 */
export async function loginApi({ email, password }) {
  const response = await apiClient.post('/auth/login', {
    email: email.trim(),
    password,
  });
  return response.data; // { user, accessToken }
}

/**
 * Register a new user account with double password verification
 */
export async function registerApi({ nombre, email, password, confirmPassword }) {
  const response = await apiClient.post('/auth/register', {
    nombre: nombre.trim(),
    email: email.trim(),
    password,
    confirmPassword,
  });
  return response.data; // { user, accessToken }
}

/**
 * Get current user profile
 */
export async function getMeApi() {
  const response = await apiClient.get('/users/me');
  return response.data; // User profile with stats
}

/**
 * Update current user profile
 */
export async function updateProfileApi(data) {
  const response = await apiClient.patch('/users/me', data);
  return response.data;
}
