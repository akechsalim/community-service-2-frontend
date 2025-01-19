class AuthService {
    static setUserData(token, username, role,userId) {
        sessionStorage.setItem('jwtToken', token);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('userId', userId);
    }

    static getUserData() {
        return {
            token: this.getToken(),
            username: sessionStorage.getItem('username'),
            role: sessionStorage.getItem('role'),
            userId : sessionStorage.getItem('userId')
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
        sessionStorage.removeItem('userId');

    }

    static getUserId() {
        return sessionStorage.getItem('userId');
    }
}

export default AuthService;