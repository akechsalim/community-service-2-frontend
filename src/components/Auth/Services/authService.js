class AuthService {
    static setUserData(token, username, role) {
        sessionStorage.setItem('jwtToken', token);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('role', role);
    }

    static getUserData() {
        return {
            token: this.getToken(),
            username: sessionStorage.getItem('username'),
            role: sessionStorage.getItem('role')
        };
    }

    static getToken() {
        return sessionStorage.getItem('jwtToken');
    }

    static getAuthHeaders() {
        const token = this.getToken();
        return token ? {'Authorization': `Bearer ${token}`} : {};
    }

    static clearUserData() {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('role');
    }
}

export default AuthService;