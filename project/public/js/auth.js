// Auth functionality
const auth = {
  token: null,
  user: null,

  async register(userData) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        return true;
      }
      throw new Error(data.message);
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  async login(credentials) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
        return true;
      }
      throw new Error(data.message);
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!this.token;
  }
};