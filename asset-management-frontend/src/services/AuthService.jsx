import api from './api';

class AuthService {
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username,
          role: response.data.role,
          employeeId: response.data.employeeId
        }));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username,
          role: response.data.role,
          employeeId: response.data.employeeId
        }));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin() {
    return this.hasRole('ROLE_ADMIN');
  }

  isUser() {
    return this.hasRole('ROLE_USER');
  }
}

export default new AuthService();