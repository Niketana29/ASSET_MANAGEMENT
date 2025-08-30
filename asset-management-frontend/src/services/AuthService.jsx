import api from "./api";


class AuthService{
    register(userData){

        return api.post("users/registration/new", userData);
    }

    login(credentials){

        return api.post("users/login/authenticate", credentials);
    }
}

export default new AuthService();