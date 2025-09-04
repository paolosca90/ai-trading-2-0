// Authentication Management
class AuthManager {
    constructor() {
        this.checkAuthOnInit();
        this.setupAuthListeners();
    }

    async checkAuthOnInit() {
        const token = localStorage.getItem(window.AppConfig.STORAGE_KEYS.AUTH_TOKEN);
        
        if (token) {
            const isValid = await this.verifyToken(token);
            window.AppState.setState({
                isAuthenticated: isValid,
                authLoading: false,
                currentUser: isValid ? this.getStoredUser() : null
            });
        } else {
            window.AppState.setState({
                isAuthenticated: false,
                authLoading: false,
                currentUser: null
            });
        }
    }

    async verifyToken(token) {
        try {
            // Handle demo tokens
            if (token.startsWith('demo-')) {
                const userData = localStorage.getItem(window.AppConfig.STORAGE_KEYS.USER_DATA);
                return !!userData;
            }

            // Verify real token with backend
            const response = await fetch(`${window.AppConfig.API_URL}/api/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    localStorage.setItem(window.AppConfig.STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
                }
                return true;
            } else {
                // Token is invalid
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            // Don't remove demo tokens on network errors
            if (!token.startsWith('demo-')) {
                this.logout();
                return false;
            }
            return token.startsWith('demo-');
        }
    }

    getStoredUser() {
        try {
            const userData = localStorage.getItem(window.AppConfig.STORAGE_KEYS.USER_DATA);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    async login(credentials) {
        try {
            const authData = await window.API.login(credentials);

            if (!authData.success || !authData.user) {
                throw new Error(authData.error || 'Invalid email or password');
            }

            // Store user data and token
            localStorage.setItem(window.AppConfig.STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));
            localStorage.setItem(window.AppConfig.STORAGE_KEYS.AUTH_TOKEN, authData.token);
            
            if (authData.refreshToken) {
                localStorage.setItem(window.AppConfig.STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
            }

            // Update app state
            window.AppState.setState({
                isAuthenticated: true,
                currentUser: authData.user
            });

            // Show success message
            this.showToast('🎉 Login Successful!', `Welcome back, ${authData.user.name || authData.user.email}!`, 'success');

            return { success: true, user: authData.user };

        } catch (error) {
            console.error('Login error:', error);
            this.showToast('❌ Login Failed', error.message, 'error');
            throw error;
        }
    }

    async register(userData) {
        try {
            const registerData = await window.API.register(userData);

            if (!registerData.success) {
                throw new Error(registerData.error || 'Registration failed');
            }

            // Store user data for compatibility
            localStorage.setItem(window.AppConfig.STORAGE_KEYS.USER_DATA, JSON.stringify(registerData.user));

            this.showToast('🎉 Registration Successful!', `Welcome ${userData.name}! ${registerData.message}`, 'success');
            
            return { success: true, user: registerData.user };

        } catch (error) {
            console.error('Registration error:', error);
            this.showToast('❌ Registration Failed', error.message, 'error');
            throw error;
        }
    }

    logout() {
        // Clear all authentication data
        localStorage.removeItem(window.AppConfig.STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(window.AppConfig.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(window.AppConfig.STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(window.AppConfig.STORAGE_KEYS.MT5_CONFIG);

        // Update app state
        window.AppState.setState({
            isAuthenticated: false,
            currentUser: null,
            currentPage: 'landing'
        });

        this.showToast('👋 Logged out', 'You have been logged out successfully', 'info');
    }

    setupAuthListeners() {
        // Listen for storage changes (logout from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === window.AppConfig.STORAGE_KEYS.AUTH_TOKEN && !e.newValue) {
                window.AppState.setState({
                    isAuthenticated: false,
                    currentUser: null
                });
                window.Router.navigate('landing');
            }
        });
    }

    showToast(title, message, type = 'info') {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        
        toast.innerHTML = `
            <div class="font-semibold">${title}</div>
            <div class="text-sm opacity-90">${message}</div>
        `;

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);
    }

    // Quick login for demo
    async quickDemoLogin() {
        return this.login(window.AppConfig.DEMO_CREDENTIALS);
    }
}

// Global Auth instance
window.Auth = new AuthManager();

console.log('🔐 Authentication Manager initialized');