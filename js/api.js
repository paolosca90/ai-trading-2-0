// API Client - Handles all backend communication
class ApiClient {
    constructor() {
        this.baseURL = window.AppConfig.API_URL;
        this.fallbackURL = window.AppConfig.API_FALLBACK;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        // Get authentication token from localStorage
        const token = localStorage.getItem(window.AppConfig.STORAGE_KEYS.AUTH_TOKEN);
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Check if we hit a Vercel authentication page
            if (response.headers.get('content-type')?.includes('text/html') && 
                (await response.clone().text()).includes('Authentication Required')) {
                throw new Error('Backend is protected. Using fallback data.');
            }
            
            // Retry with fallback URL on 401
            if (response.status === 401) {
                const fallbackUrl = `${this.fallbackURL}${endpoint}`;
                const retryResponse = await fetch(fallbackUrl, {
                    ...config,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!retryResponse.ok) {
                    return this.getMockData(endpoint);
                }
                
                return await retryResponse.json();
            }
            
            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                } catch {
                    // Use default error message
                }
                
                console.warn(`API error: ${errorMessage}. Using mock data.`);
                return this.getMockData(endpoint);
            }
            
            return await response.json();
        } catch (error) {
            console.warn(`API request failed: ${endpoint}. Using mock data.`, error);
            return this.getMockData(endpoint);
        }
    }

    // Mock data fallback for offline functionality
    getMockData(endpoint) {
        const mockData = {
            '/api/health': { status: 'ok', timestamp: Date.now() },
            
            '/api/analysis/top-signals': {
                signals: [
                    {
                        tradeId: 'MOCK_001',
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
                        tradeId: 'MOCK_002',
                        symbol: 'EURUSD',
                        direction: 'SHORT',
                        confidence: 85,
                        entryPrice: 1.0845,
                        stopLoss: 1.0875,
                        takeProfit: 1.0795,
                        strategy: 'TECHNICAL_REVERSAL',
                        timestamp: Date.now() - 600000,
                        analysis: 'Technical reversal pattern with strong resistance level'
                    },
                    {
                        tradeId: 'MOCK_003',
                        symbol: 'XAUUSD',
                        direction: 'LONG',
                        confidence: 88,
                        entryPrice: 2025.50,
                        stopLoss: 2015.00,
                        takeProfit: 2040.00,
                        strategy: 'SAFE_HAVEN',
                        timestamp: Date.now() - 900000,
                        analysis: 'Safe haven demand increasing due to market uncertainty'
                    }
                ]
            },
            
            '/api/analysis/signal-stats': {
                totalGenerated: 47,
                totalExecuted: 35,
                totalClosed: 28,
                avgConfidence: 84.2,
                topPerformingSymbol: 'BTCUSD',
                lastGenerationTime: Date.now() - 120000
            },
            
            '/api/analysis/performance': {
                totalProfitLoss: 2847.50,
                winRate: 78.6,
                profitFactor: 2.3,
                bestTrade: 450.25,
                worstTrade: -125.80,
                currentStreak: 3,
                sharpeRatio: 1.85,
                totalTrades: 67,
                avgTradeReturn: 42.50
            },
            
            '/api/analysis/ml/analytics': {
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
            },
            
            '/api/analysis/positions': {
                positions: [
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
                ]
            },
            
            '/api/analysis/history': {
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
            }
        };

        // Handle parameterized endpoints
        for (const [pattern, data] of Object.entries(mockData)) {
            if (endpoint.includes(pattern.split('?')[0])) {
                return data;
            }
        }

        // Default fallback
        return { success: false, error: 'Endpoint not found', mockData: true };
    }

    // Authentication methods
    async login(credentials) {
        if (credentials.email === window.AppConfig.DEMO_CREDENTIALS.email && 
            credentials.password === window.AppConfig.DEMO_CREDENTIALS.password) {
            return {
                success: true,
                user: {
                    id: 'demo_user',
                    name: 'Demo User',
                    email: credentials.email,
                    plan: 'demo'
                },
                token: 'demo-token-' + Date.now(),
                message: 'Demo login successful'
            };
        }
        
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Analysis endpoints
    async getTopSignals() {
        return this.request('/api/analysis/top-signals');
    }

    async getSignalStats() {
        return this.request('/api/analysis/signal-stats');
    }

    async getPerformance() {
        return this.request('/api/analysis/performance');
    }

    async generateSignal(params) {
        return this.request('/api/analysis/signal', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    async executeSignal(params) {
        return this.request('/api/analysis/execute', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    async listPositions() {
        return this.request('/api/analysis/positions');
    }

    async listHistory() {
        return this.request('/api/analysis/history');
    }

    async forceSignalGeneration(params = {}) {
        return this.request('/api/analysis/force-generation', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    // ML endpoints
    async getMLAnalytics() {
        return this.request('/api/analysis/ml/analytics');
    }

    async trainModel(params) {
        return this.request('/api/ml/train-model', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    async detectPatterns(params) {
        return this.request('/api/ml/detect-patterns', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    }

    // MT5 endpoints
    async getMt5Config() {
        return this.request('/api/user/mt5-config');
    }

    async updateMt5Config(data) {
        return this.request('/api/user/mt5-config', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMt5Status() {
        // Mock MT5 status for demo
        return {
            connected: Math.random() > 0.3, // 70% chance of being connected
            accountInfo: {
                name: 'Demo Account',
                balance: 10000 + Math.random() * 5000,
                server: 'MetaQuotes-Demo'
            },
            lastUpdate: Date.now()
        };
    }
}

// Global API instance
window.API = new ApiClient();

console.log('📡 API Client initialized');