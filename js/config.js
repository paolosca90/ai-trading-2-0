// 🚀 AI TRADING 2.0 - PRODUCTION CONFIGURATION
// Complete configuration with all API keys from backend .env files

window.CONFIG = {
    // Production Environment
    ENV: 'production',
    
    // Backend API - Existing Production Backend
    API_BASE_URL: 'https://backend-kzbh2zv05-paolos-projects-dc6990da.vercel.app',
    
    // Supabase Database Configuration (Production)
    SUPABASE: {
        URL: 'https://jeewrxgqkgvtrphebcxz.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZXdyeGdxa2d2dHJwaGViY3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzAzNDksImV4cCI6MjA3MjIwNjM0OX0.W1ufn1l_zArMyAaameVwo2a4Z7cmSoGV27zvki57tMI'
    },
    
    // MT5 Trading Configuration (Production VPS)
    MT5: {
        HOST: '154.61.187.189',
        PORT: 8080,
        API_URL: 'http://154.61.187.189:8080',
        LOGIN: '67163307',
        SERVER: 'RoboForex-ECN',
        BROKER: 'RoboForex',
        ENABLE_REAL_DATA: true,
        ENABLE_REAL_TRADING: true,
        ENABLE_DEMO_MODE: true,
    },
    
    // SendGrid Email Configuration
    EMAIL: {
        SENDGRID_API_KEY: 'your_sendgrid_api_key_here', // Set via environment variables
        FROM_EMAIL: 'ai@cash-revolution.com',
        FROM_NAME: 'AI Cash Revolution',
        SUPPORT_EMAIL: 'ai@cash-revolution.com'
    },
    
    // Stripe Payment Configuration
    STRIPE: {
        PUBLISHABLE_KEY: 'pk_live_your_live_stripe_key_here'
    },
    
    // Trading Safety Settings
    TRADING: {
        DEFAULT_RISK_PERCENTAGE: 2,
        MAX_RISK_PERCENTAGE: 10,
        MAX_DAILY_TRADES: 50,
        DEFAULT_ACCOUNT_BALANCE: 10000
    },
    
    // Application Settings
    APP: {
        NAME: 'AI Trading 2.0',
        VERSION: '2.0.0',
        FRONTEND_URL: window.location.origin,
        DEPLOYMENT_PLATFORM: 'render',
        STATIC_HOSTING: true
    },
    
    // Features Enabled
    FEATURES: {
        ENABLE_REAL_TRADING: true,
        ENABLE_DEMO_MODE: true,
        ENABLE_ML_ANALYTICS: true,
        ENABLE_PATTERN_DETECTION: true,
        ENABLE_PERFORMANCE_MONITORING: true
    },
    
    // Security Keys (encoded for frontend use)
    SECURITY: {
        JWT_SECRET_HASH: 'your-production-jwt-secret-key-64-chars-minimum-security-abc123',
        API_TIMEOUT: 30000 // 30 seconds
    },
    
    // Asset Categories for Trading
    ASSETS: {
        "🔥 Popolari": [
            "BTCUSD", "ETHUSD", "EURUSD", "GBPUSD", "XAUUSD", "US500", "NAS100", "US30"
        ],
        "💱 Forex Majors": [
            "EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD", "NZDUSD"
        ],
        "💱 Forex Minors": [
            "EURGBP", "EURJPY", "EURCHF", "EURAUD", "EURCAD", "EURNZD", 
            "GBPJPY", "GBPCHF", "GBPAUD", "GBPCAD", "GBPNZD",
            "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD",
            "NZDJPY", "NZDCHF", "NZDCAD",
            "CADJPY", "CADCHF", "CHFJPY"
        ],
        "💱 Forex Exotics": [
            "USDSEK", "USDNOK", "USDDKK", "USDPLN", "USDHUF", "USDCZK",
            "USDTRY", "USDZAR", "USDMXN", "USDBRL", "USDSGD", "USDHKD",
            "EURPLN", "EURSEK", "EURNOK", "EURDKK", "EURTRY", "EURZAR",
            "GBPPLN", "GBPSEK", "GBPNOK", "GBPDKK", "GBPTRY", "GBPZAR"
        ],
        "📈 Indici CFD": [
            "US30", "US500", "SPX500", "NAS100", "UK100", "GER40", "FRA40", "ESP35", 
            "ITA40", "AUS200", "JPN225", "HK50", "CHINA50", "INDIA50"
        ],
        "🏗️ Materie Prime": [
            "XAUUSD", "XAGUSD", "XPTUSD", "XPDUSD",
            "CRUDE", "BRENT", "NATGAS",
            "WHEAT", "CORN", "SOYBEAN", "SUGAR", "COFFEE", "COCOA", "COTTON"
        ],
        "₿ Criptovalute": [
            "BTCUSD", "ETHUSD", "LTCUSD", "XRPUSD", "ADAUSD", "DOTUSD", 
            "LINKUSD", "BCHUSD", "XLMUSD", "EOSUSD"
        ]
    },
    
    // Trading Strategies
    STRATEGIES: {
        auto: {
            name: "🤖 Strategia Automatica",
            description: "L'AI sceglie la strategia ottimale basandosi sulle condizioni di mercato"
        },
        scalping: {
            name: "⚡ Scalping", 
            description: "Trade veloci (1-15 min) per catturare piccoli movimenti"
        },
        intraday: {
            name: "📊 Intraday",
            description: "Posizioni mantenute per 1-6 ore con chiusura automatica"
        }
    }
};

// Global API Helper Functions
window.API = {
    // Make authenticated requests to backend
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers,
                timeout: CONFIG.SECURITY.API_TIMEOUT
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    },
    
    // Trading API endpoints
    async generateSignal(symbol, strategy) {
        return await this.request('/analysis/predict', {
            method: 'POST',
            body: JSON.stringify({ symbol, strategy })
        });
    },
    
    async executeTradeSignal(tradeId, lotSize) {
        return await this.request('/analysis/execute', {
            method: 'POST', 
            body: JSON.stringify({ tradeId, lotSize })
        });
    },
    
    async getPositions() {
        return await this.request('/analysis/positions');
    },
    
    async closePosition(ticket) {
        return await this.request('/analysis/close-position', {
            method: 'POST',
            body: JSON.stringify({ ticket })
        });
    },
    
    async getPerformance() {
        return await this.request('/analysis/performance');
    },
    
    async getTopSignals() {
        return await this.request('/analysis/top-signals');
    },
    
    async getSignalStats() {
        return await this.request('/analysis/signal-stats');
    },
    
    async forceSignalGeneration() {
        return await this.request('/analysis/force-signal-generation', {
            method: 'POST'
        });
    },
    
    // ML API endpoints
    async getMLAnalytics() {
        return await this.request('/ml/analytics');
    },
    
    async trainModel() {
        return await this.request('/ml/train-model', {
            method: 'POST'
        });
    },
    
    async detectPatterns(symbol) {
        return await this.request('/ml/detect-patterns', {
            method: 'POST',
            body: JSON.stringify({ symbol })
        });
    },
    
    // MT5 Status
    async getMT5Status() {
        try {
            const response = await fetch(`${CONFIG.MT5.API_URL}/status`);
            return await response.json();
        } catch (error) {
            console.error('MT5 Status check failed:', error);
            return { connected: false, error: error.message };
        }
    },
    
    // User authentication
    async login(email, password) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },
    
    async register(email, password, name) {
        return await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
    },
    
    async getUserProfile() {
        return await this.request('/auth/profile');
    }
};

// Utility Functions
window.UTILS = {
    // Format currency
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format percentage
    formatPercentage(value) {
        return `${(value * 100).toFixed(2)}%`;
    },
    
    // Get color for profit/loss
    getProfitColor(value) {
        return value >= 0 ? 'text-green-600' : 'text-red-600';
    },
    
    // Format timestamp
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    },
    
    // Show notification
    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').onclick = () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        };
    }
};

console.log('🚀 AI Trading 2.0 Configuration loaded successfully!');
console.log('Backend API:', CONFIG.API_BASE_URL);
console.log('MT5 Server:', `${CONFIG.MT5.HOST}:${CONFIG.MT5.PORT}`);
console.log('Environment:', CONFIG.ENV);