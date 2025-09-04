import api from "./api";

class AuthService {
  async register(userData) {
    return await api.post("/users/registration/new", userData);
  }

  async login(credentials) {
    const response = await api.post("/users/login/authenticate", credentials);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      const userData = {
        id: response.data.userId,          
        employeeId: response.data.employeeId,
        username: response.data.username,
        roles: response.data.roles,
        token: response.data.token
      };
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("User stored in localStorage:", userData);
    }

    return response.data;
  }


  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getRoles() {
    const user = this.getCurrentUser();
    return user ? user.roles : null; 
  }
}

export default new AuthService();
