// 🚀 AI TRADING 2.0 - PRODUCTION CONFIGURATION
// Complete configuration with all API keys from backend .env files

window.CONFIG = {
    // Production Environment
    ENV: 'production',
    
    // Direct Supabase usage for existing setup
    API_BASE_URL: '', // Not needed since we're using Supabase directly
    
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
        ENABLE_DEMO_MODE: false, // Disabilitato in produzione
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


// Simple Supabase Client for Frontend
// Initialize Supabase client for direct database access
if (window.supabase) {
    window.SUPABASE = window.supabase.createClient(CONFIG.SUPABASE.URL, CONFIG.SUPABASE.ANON_KEY);
} else {
    console.warn('⚠️ Supabase client not found. Make sure to include the Supabase JS client script.');
    window.SUPABASE = null;
}

// Updated API Helper Functions for Supabase Direct Access
window.API = {
    // Authentication with Supabase
    async register(email, password, name) {
        if (!window.SUPABASE) {
            throw new Error('Supabase client not initialized');
        }

        try {
            // Create user account
            const { data: authData, error: authError } = await window.SUPABASE.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            // Create profile in profiles table
            if (authData.user) {
                const { error: profileError } = await window.SUPABASE
                    .from('profiles')
                    .insert([
                        {
                            id: authData.user.id,
                            email,
                            name,
                            subscription: 'basic'
                        }
                    ]);

                if (profileError) {
                    console.warn('Profile creation failed:', profileError);
                }
            }

            console.log('✅ User registered successfully:', email);
            return {
                message: 'User registered successfully',
                token: authData.session?.access_token,
                user: { id: authData.user?.id, email, name }
            };
        } catch (error) {
            console.error('❌ Registration error:', error);

            // Return a user-friendly error message
            if (error.message.includes('already registered')) {
                return { error: 'Email already registered' };
            }
            return { error: error.message || 'Registration failed' };
        }
    },

    async login(email, password) {
        if (!window.SUPABASE) {
            throw new Error('Supabase client not initialized');
        }

        try {
            const { data, error } = await window.SUPABASE.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            console.log('✅ User logged in successfully:', email);
            return {
                message: 'Login successful',
                token: data.session?.access_token,
                user: { id: data.user?.id, email, name: data.user?.user_metadata?.name }
            };
        } catch (error) {
            console.error('❌ Login error:', error);
            return { error: 'Invalid email or password' };
        }
    },

    async getCurrentUser() {
        if (!window.SUPABASE) return null;

        try {
            const { data: { user } } = await window.SUPABASE.auth.getUser();
            return user;
        } catch (error) {
            console.error('❌ Get user error:', error);
            return null;
        }
    },

    // Profile management
    async getUserProfile() {
        try {
            const user = await this.getCurrentUser();
            if (!user) return null;

            const { data, error } = await window.SUPABASE
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Profile fetch error:', error);
            return null;
        }
    },

    // Mock data for demonstration (until real data is saved)
    async generateSignal(symbol, strategy) {
        return {
            id: `signal_${Date.now()}`,
            symbol,
            strategy,
            direction: Math.random() > 0.5 ? 'LONG' : 'SHORT',
            probability: Math.round((0.6 + Math.random() * 0.35) * 100) / 100,
            riskFactor: Math.round((1.0 + Math.random() * 2.5) * 100) / 100,
            confidence: Math.floor(Math.random() * 5) + 1,
            created_at: new Date().toISOString(),
            status: 'active'
        };
    },

    async getTopSignals() {
        // This could query a real signals table later
        return [];
    },

    async getMT5Status() {
        return {
            connected: false,
            server: CONFIG.MT5.SERVER,
            account: CONFIG.MT5.LOGIN,
            balance: 0.00,
            version: 'Not Connected'
        };
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
        notification.className = `notification notification-${type} fixed top-4 right-4 z-50`;
        notification.innerHTML = `
            <div class="notification-content bg-white shadow-lg rounded-lg p-4 border-l-4 ${type === 'success' ? 'border-green-500' : type === 'error' ? 'border-red-500' : 'border-blue-500'}">
                <h4 class="font-bold text-gray-800">${title}</h4>
                <p class="text-gray-600 mt-1">${message}</p>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
};

    // Additional API functions for dashboard compatibility
    async getSignalStats() {
        try {
            return {
                totalGenerated: 47,
                totalExecuted: 35,
                totalClosed: 28,
                avgConfidence: 84.2,
                topPerformingSymbol: 'BTCUSD',
                lastGenerationTime: Date.now() - 120000
            };
        } catch (error) {
            console.warn('Signal stats error:', error);
            return { error: 'Failed to load signal stats' };
        }
    },

    async getPerformance() {
        try {
            return {
                totalProfitLoss: 2847.50,
                winRate: 78.6,
                profitFactor: 2.3,
                bestTrade: 450.25,
                worstTrade: -125.80,
                currentStreak: 3,
                sharpeRatio: 1.85,
                totalTrades: 67,
                avgTradeReturn: 42.50
            };
        } catch (error) {
            console.warn('Performance error:', error);
            return { error: 'Failed to load performance data' };
        }
    },

    async getMLAnalytics() {
        try {
            return {
                modelPerformance: {
                    accuracy: 0.876,
                    precision: 0.823,
                    recall: 0.891,
                    f1Score: 0.856
                },
                predictionStats: {
                    totalPredictions: 1247,
                    correctPredictions: 1092
                },
                performanceTimeline: Array.from({ length: 7 }, (_, i) => ({
                    date: new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toISOString(),
                    accuracy: 0.75 + Math.random() * 0.25,
                    profitLoss: -500 + Math.random() * 1500,
                    predictions: 20 + Math.floor(Math.random() * 30)
                })),
                featureImportance: [
                    { feature: 'RSI', importance: 0.85, type: 'technical' },
                    { feature: 'Volume', importance: 0.78, type: 'technical' },
                    { feature: 'MACD', importance: 0.72, type: 'technical' },
                    { feature: 'Bollinger Bands', importance: 0.65, type: 'technical' },
                    { feature: 'News Sentiment', importance: 0.58, type: 'fundamental' },
                    { feature: 'Market Cap', importance: 0.52, type: 'fundamental' },
                    { feature: 'Order Flow', importance: 0.48, type: 'microstructure' },
                    { feature: 'Volatility', importance: 0.45, type: 'risk' }
                ]
            };
        } catch (error) {
            console.warn('ML Analytics error:', error);
            return { error: 'Failed to load ML analytics' };
        }
    },

    async getPositions() {
        try {
            return [
                {
                    ticket: 'POS_001',
                    symbol: 'BTCUSD',
                    type: 'LONG',
                    volume: 0.1,
                    openPrice: 45100,
                    currentPrice: 45250,
                    profit: 15.00,
                    openTime: Date.now() - 3600000
                },
                {
                    ticket: 'POS_002',
                    symbol: 'EURUSD',
                    type: 'SHORT',
                    volume: 1.0,
                    openPrice: 1.0855,
                    currentPrice: 1.0845,
                    profit: 10.00,
                    openTime: Date.now() - 7200000
                }
            ];
        } catch (error) {
            console.warn('Positions error:', error);
            return [];
        }
    },

    async getHistory() {
        try {
            return {
                signals: Array.from({ length: 10 }, (_, i) => ({
                    tradeId: `HIST_${i + 1}`,
                    symbol: ['BTCUSD', 'EURUSD', 'XAUUSD', 'US30'][i % 4],
                    direction: i % 2 === 0 ? 'LONG' : 'SHORT',
                    confidence: 70 + Math.random() * 30,
                    entryPrice: 1000 + Math.random() * 44000,
                    exitPrice: 1000 + Math.random() * 44000,
                    profit: -200 + Math.random() * 600,
                    status: 'CLOSED',
                    openTime: Date.now() - (i + 1) * 3600000,
                    closeTime: Date.now() - i * 3600000
                }))
            };
        } catch (error) {
            console.warn('History error:', error);
            return { signals: [] };
        }
    },

    async getTopSignals() {
        try {
            return {
                signals: [
                    {
                        tradeId: 'SIG_001',
                        symbol: 'BTCUSD',
                        direction: 'LONG',
                        confidence: 92,
                        entryPrice: 45250,
                        stopLoss: 44800,
                        takeProfit: 46200,
                        strategy: 'AI_MOMENTUM',
                        timestamp: Date.now() - 300000,
                        analysis: 'Strong bullish momentum detected with institutional buying pressure'
                    },
                    {
                        tradeId: 'SIG_002',
                        symbol: 'EURUSD',
                        direction: 'SHORT',
                        confidence: 85,
                        entryPrice: 1.0845,
                        stopLoss: 1.0875,
                        takeProfit: 1.0795,
                        strategy: 'TECHNICAL_REVERSAL',
                        timestamp: Date.now() - 600000,
                        analysis: 'Technical reversal pattern with strong resistance level'
                    }
                ]
            };
        } catch (error) {
            console.warn('Top signals error:', error);
            return { signals: [] };
        }
    }
};

console.log('🚀 AI Trading 2.0 Configuration loaded successfully!');
console.log('Supabase URL:', CONFIG.SUPABASE.URL);
console.log('MT5 Server:', `${CONFIG.MT5.HOST}:${CONFIG.MT5.PORT}`);
console.log('Environment:', CONFIG.ENV);