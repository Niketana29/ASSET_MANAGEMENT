import api from "./api";

class AuthService {
  async register(userData) {
    const res = await api.post("/users/registration/new", userData);
    return res.data;
  }

  async login(credentials) {
    const res = await api.post("/users/login/authenticate", credentials);
    console.log("Login API raw response:", res.data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);

      const rolesArray = (res.data.roles || "")
        .split(",")
        .map((r) => r.replace(/^ROLE_/, "").trim().toUpperCase());

      const userData = {
        id: res.data.userId,
        employeeId: res.data.employeeId,
        username: res.data.username,
        roles: rolesArray,
        token: res.data.token
      };
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("User stored in localStorage:", userData);
    }

    return res.data;
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
