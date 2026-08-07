console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }
      return data.data; // { user, token }
    } catch (err) {
      if (err.name === 'TypeError') {
        throw new Error('Unable to connect to backend authentication server. Ensure server is running on port 5000.');
      }
      throw err;
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return data.data; // { user, token }
    } catch (err) {
      if (err.name === 'TypeError') {
        throw new Error('Unable to connect to backend authentication server. Ensure server is running on port 5000.');
      }
      throw err;
    }
  },

  registerAdmin: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Admin registration failed');
      }
      return data.data; // { user, token }
    } catch (err) {
      if (err.name === 'TypeError') {
        throw new Error('Unable to connect to backend authentication server. Ensure server is running on port 5000.');
      }
      throw err;
    }
  },

  getMe: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Session expired');
      }
      return data.data.user;
    } catch (err) {
      throw err;
    }
  }
};

export default authService;