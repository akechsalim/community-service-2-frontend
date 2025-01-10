class AuthService {
    // Store the token after login
    static setToken(token) {
        sessionStorage.setItem('jwtToken', token);  // Use sessionStorage instead of localStorage
    }

    // Get the token when needed
    static getToken() {
        return sessionStorage.getItem('jwtToken');  // Retrieve from sessionStorage
    }

    // Add token to the Authorization header of each request
    static getAuthHeaders() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Clear the token on logout
    static clearToken() {
        sessionStorage.removeItem('jwtToken');  // Clear from sessionStorage
    }
}

export default AuthService;
