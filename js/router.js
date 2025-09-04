// Router for Single Page Application
class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = '';
        this.setupRoutes();
        this.init();
    }

    setupRoutes() {
        // Public routes
        this.addRoute('landing', () => this.renderLandingPage());
        this.addRoute('login', () => this.renderLoginPage());
        this.addRoute('register', () => this.renderRegisterPage());
        this.addRoute('subscribe', () => this.renderSubscribePage());

        // Protected routes
        this.addRoute('dashboard', () => this.renderDashboardPage(), true);
        this.addRoute('ml-dashboard', () => this.renderMLDashboardPage(), true);
        this.addRoute('trade', () => this.renderTradePage(), true);
        this.addRoute('news', () => this.renderNewsPage(), true);
        this.addRoute('history', () => this.renderHistoryPage(), true);
        this.addRoute('guides', () => this.renderGuidesPage(), true);
        this.addRoute('downloads', () => this.renderDownloadsPage(), true);
        this.addRoute('settings', () => this.renderSettingsPage(), true);
        this.addRoute('billing', () => this.renderBillingPage(), true);
        this.addRoute('mt5-setup', () => this.renderMT5SetupPage(), true);
    }

    addRoute(path, handler, requiresAuth = false) {
        this.routes.set(path, { handler, requiresAuth });
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle initial route
        this.handleRoute();

        // Listen for authentication changes
        window.addEventListener('stateChanged', (e) => {
            if (e.detail.hasOwnProperty('isAuthenticated')) {
                this.handleRoute();
            }
        });
    }

    navigate(path, pushState = true) {
        if (pushState) {
            window.history.pushState({}, '', `#${path}`);
        }
        this.currentPage = path;
        window.AppState.setState({ currentPage: path });
        this.handleRoute();
    }

    handleRoute() {
        let path = window.location.hash.slice(1) || 'landing';
        
        // Default authenticated route
        if (path === 'landing' && window.AppState.isAuthenticated) {
            path = 'dashboard';
        }

        const route = this.routes.get(path);
        
        if (!route) {
            this.navigate('landing');
            return;
        }

        // Check authentication
        if (route.requiresAuth && !window.AppState.isAuthenticated) {
            this.navigate('login');
            return;
        }

        // Redirect authenticated users from public pages
        if (!route.requiresAuth && window.AppState.isAuthenticated && path !== 'landing') {
            this.navigate('dashboard');
            return;
        }

        this.currentPage = path;
        window.AppState.setState({ currentPage: path });

        // Execute route handler
        try {
            route.handler();
        } catch (error) {
            console.error('Route handler error:', error);
            this.navigate('dashboard');
        }
    }

    // Page renderers
    renderLandingPage() {
        const content = `
            <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
                <!-- Hero Section -->
                <section class="relative overflow-hidden">
                    <div class="absolute inset-0 bg-grid opacity-20"></div>
                    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                        <div class="text-center">
                            <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-8">
                                <i data-lucide="sparkles" class="h-4 w-4"></i>
                                <span>Nuova Versione 3.0 - Con Analisi Istituzionale</span>
                            </div>
                            
                            <h1 class="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                Trading AI <span class="gradient-text">Avanzato</span>
                            </h1>
                            <p class="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
                                Piattaforma all-in-one per trading automatizzato con intelligenza artificiale, 
                                analisi tecnica avanzata e connessione MT5 diretta.
                            </p>
                            
                            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                ${Components.createButton({ 
                                    text: 'Accedi alla Demo', 
                                    variant: 'primary', 
                                    size: 'large',
                                    onclick: 'Router.navigate("login")',
                                    icon: 'rocket'
                                })}
                                ${Components.createButton({ 
                                    text: 'Vedi Piani', 
                                    variant: 'outline', 
                                    size: 'large',
                                    onclick: 'Router.navigate("subscribe")',
                                    icon: 'play'
                                })}
                            </div>
                            
                            <!-- Stats -->
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-cyan-400">98%</div>
                                    <div class="text-sm text-blue-200 mt-1">Accuracy AI</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-cyan-400">150+</div>
                                    <div class="text-sm text-blue-200 mt-1">Asset Supportati</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-cyan-400">24/7</div>
                                    <div class="text-sm text-blue-200 mt-1">Trading Automatico</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl md:text-3xl font-bold text-cyan-400">0.1%</div>
                                    <div class="text-sm text-blue-200 mt-1">Commissioni Basse</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- How it Works -->
                <section class="py-20 bg-gray-50 text-gray-900">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="text-center mb-16">
                            <h2 class="text-3xl md:text-4xl font-bold mb-4">Come Funziona in 3 Semplici Passi</h2>
                            <p class="text-xl text-gray-600">Dal setup alla prima operazione in meno di 10 minuti</p>
                        </div>
                        
                        <div class="grid md:grid-cols-3 gap-8">
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span class="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-3">Registrati e Accedi</h3>
                                <p class="text-gray-600 mb-4">Crea il tuo account gratuito e accedi alla piattaforma demo.</p>
                                ${Components.createButton({ text: 'Registrati Ora', variant: 'outline', onclick: 'Router.navigate("register")' })}
                            </div>
                            
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span class="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-3">Connetti MT5</h3>
                                <p class="text-gray-600 mb-4">Collega il tuo account MetaTrader 5 seguendo la guida integrata.</p>
                                ${Components.createButton({ text: 'Vedi Guida MT5', variant: 'outline', onclick: 'Router.navigate("downloads")' })}
                            </div>
                            
                            <div class="text-center">
                                <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span class="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 class="text-xl font-semibold mb-3">Trading Automatico</h3>
                                <p class="text-gray-600 mb-4">Attiva l'AI e inizia a ricevere segnali automatici.</p>
                                ${Components.createButton({ text: 'Inizia Demo', variant: 'outline', onclick: 'Auth.quickDemoLogin()' })}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CTA -->
                <section class="py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
                    <div class="max-w-4xl mx-auto px-4 text-center">
                        <h2 class="text-3xl md:text-4xl font-bold mb-6">Pronto a Rivoluzionare il Tuo Trading?</h2>
                        <p class="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                            Unisciti a migliaia di trader che stanno già utilizzando la nostra piattaforma 
                            per ottenere risultati straordinari nel trading automatico.
                        </p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            ${Components.createButton({ 
                                text: 'Prova Demo Gratuita', 
                                variant: 'primary', 
                                size: 'large',
                                onclick: 'Auth.quickDemoLogin()',
                                icon: 'rocket'
                            })}
                            ${Components.createButton({ 
                                text: 'Vedi Piani e Prezzi', 
                                variant: 'outline', 
                                size: 'large',
                                onclick: 'Router.navigate("subscribe")',
                                icon: 'users'
                            })}
                        </div>
                    </div>
                </section>
            </div>
        `;

        document.getElementById('content').innerHTML = content;
        Components.initializeIcons();
    }

    renderLoginPage() {
        const content = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div class="w-full max-w-md space-y-6">
                    <!-- Back to Home -->
                    <div class="mb-6">
                        ${Components.createButton({ 
                            text: 'Torna alla Home', 
                            variant: 'ghost',
                            onclick: 'Router.navigate("landing")',
                            icon: 'arrow-left'
                        })}
                    </div>
                    
                    <!-- Header -->
                    <div class="text-center space-y-2">
                        <div class="flex justify-center mb-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <i data-lucide="trending-up" class="h-8 w-8 text-white"></i>
                            </div>
                        </div>
                        <h1 class="text-3xl font-bold gradient-text">AI Trading Boost</h1>
                        <p class="text-gray-600">Sign in to your trading account</p>
                        <div class="flex justify-center gap-2 mt-3">
                            ${Components.createBadge({ text: '🤖 AI Powered', variant: 'success' })}
                            ${Components.createBadge({ text: '🚀 24/7 Active', variant: 'primary' })}
                        </div>
                    </div>

                    <!-- Login Form -->
                    <div class="bg-white/80 backdrop-blur rounded-lg shadow-xl border p-6">
                        <div class="mb-6">
                            <h2 class="text-2xl font-semibold text-center flex items-center justify-center gap-2">
                                <i data-lucide="lock" class="h-5 w-5"></i>
                                Sign In
                            </h2>
                            <p class="text-sm text-center text-gray-600 mt-2">Access your AI trading dashboard</p>
                        </div>

                        <form id="loginForm" class="space-y-4">
                            <!-- Email Field -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div class="relative">
                                    <i data-lucide="mail" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        required
                                        placeholder="demo@tradingai.com"
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                </div>
                            </div>

                            <!-- Password Field -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div class="relative">
                                    <i data-lucide="lock" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        required
                                        placeholder="demo123"
                                        class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                </div>
                            </div>

                            <!-- Demo Notice -->
                            <div class="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                                <strong>Demo:</strong> Use demo@tradingai.com / demo123 for instant access
                            </div>

                            <!-- Login Button -->
                            <button 
                                type="submit" 
                                class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Sign In
                            </button>

                            <!-- Register Link -->
                            <div class="text-center">
                                <p class="text-sm text-gray-600">
                                    Don't have an account? 
                                    <a href="#" onclick="Router.navigate('register')" class="text-blue-600 hover:text-blue-700 underline font-medium">
                                        Create Free Account
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('content').innerHTML = content;
        Components.initializeIcons();

        // Setup form handler
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                await window.Auth.login({ email, password });
                this.navigate('dashboard');
            } catch (error) {
                // Error already handled in Auth.login
            }
        });
    }

    renderRegisterPage() {
        const content = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div class="w-full max-w-md space-y-6">
                    <!-- Back to Home -->
                    <div class="mb-6">
                        ${Components.createButton({ 
                            text: 'Torna alla Home', 
                            variant: 'ghost',
                            onclick: 'Router.navigate("landing")',
                            icon: 'arrow-left'
                        })}
                    </div>
                    
                    <!-- Header -->
                    <div class="text-center space-y-2">
                        <div class="flex justify-center mb-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <i data-lucide="trending-up" class="h-8 w-8 text-white"></i>
                            </div>
                        </div>
                        <h1 class="text-3xl font-bold gradient-text">AI Trading Boost</h1>
                        <p class="text-gray-600">Create your trading account</p>
                        <div class="flex justify-center gap-2 mt-3">
                            ${Components.createBadge({ text: '🎁 7-Day Free Trial', variant: 'success' })}
                            ${Components.createBadge({ text: '💳 No Credit Card', variant: 'primary' })}
                        </div>
                    </div>

                    <!-- Register Form -->
                    <div class="bg-white/80 backdrop-blur rounded-lg shadow-xl border p-6">
                        <div class="mb-6">
                            <h2 class="text-2xl font-semibold text-center flex items-center justify-center gap-2">
                                <i data-lucide="user" class="h-5 w-5"></i>
                                Create Account
                            </h2>
                            <p class="text-sm text-center text-gray-600 mt-2">Start your free trial today</p>
                        </div>

                        <form id="registerForm" class="space-y-4">
                            <!-- Name Field -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <div class="relative">
                                    <i data-lucide="user" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        required
                                        placeholder="Enter your full name"
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                </div>
                            </div>

                            <!-- Email Field -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div class="relative">
                                    <i data-lucide="mail" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        required
                                        placeholder="Enter your email"
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                </div>
                            </div>

                            <!-- Password Field -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div class="relative">
                                    <i data-lucide="lock" class="absolute left-3 top-3 h-4 w-4 text-gray-400"></i>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        required
                                        placeholder="Create a password"
                                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                </div>
                                <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
                            </div>

                            <!-- Terms -->
                            <div class="flex items-start space-x-2">
                                <input type="checkbox" id="acceptTerms" required class="mt-1">
                                <label for="acceptTerms" class="text-sm text-gray-700">
                                    I agree to the Terms of Service and Privacy Policy
                                </label>
                            </div>

                            <!-- Register Button -->
                            <button 
                                type="submit" 
                                class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Create Free Account
                            </button>

                            <!-- Login Link -->
                            <div class="text-center">
                                <p class="text-sm text-gray-600">
                                    Already have an account? 
                                    <a href="#" onclick="Router.navigate('login')" class="text-blue-600 hover:text-blue-700 underline font-medium">
                                        Sign In
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('content').innerHTML = content;
        Components.initializeIcons();

        // Setup form handler
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (password.length < 8) {
                Utils.showNotification('Password must be at least 8 characters long', 'error');
                return;
            }

            try {
                await window.Auth.register({ name, email, password });
                this.navigate('login');
            } catch (error) {
                // Error already handled in Auth.register
            }
        });
    }

    renderDashboardPage() {
        this.renderWithLayout(`
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">🚀 AI Trading Boost Dashboard</h1>
                        <p class="text-gray-600">Sistema di trading automatizzato con intelligenza artificiale avanzata</p>
                    </div>
                    <div class="flex gap-2">
                        ${Components.createButton({ 
                            text: '⚡ Genera Segnale', 
                            variant: 'primary',
                            onclick: 'Router.navigate("trade")'
                        })}
                        ${Components.createButton({ 
                            text: '🤖 Addestra AI', 
                            variant: 'outline',
                            onclick: 'trainAIModel()'
                        })}
                    </div>
                </div>

                <!-- Performance Stats -->
                <div id="performanceStats" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    ${Array.from({ length: 4 }, () => Components.createLoadingSkeleton('card')).join('')}
                </div>

                <!-- Signals Section -->
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold">🎯 Segnali AI Automatici</h2>
                        ${Components.createButton({ 
                            text: 'Aggiorna', 
                            variant: 'outline',
                            size: 'small',
                            onclick: 'refreshSignals()',
                            icon: 'refresh-cw'
                        })}
                    </div>
                    <div id="signalsGrid" class="grid gap-4 md:grid-cols-3">
                        ${Array.from({ length: 3 }, () => Components.createLoadingSkeleton('card')).join('')}
                    </div>
                </div>

                <!-- Trading Activity -->
                <div class="grid gap-6 md:grid-cols-2">
                    <!-- Positions -->
                    <div class="bg-white rounded-lg shadow-md border">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold">Posizioni Aperte</h3>
                        </div>
                        <div class="p-6">
                            <div id="positionsTable" class="overflow-x-auto">
                                <div class="text-center py-4">
                                    <div class="loading-spinner mx-auto mb-2"></div>
                                    <p class="text-gray-500">Caricamento posizioni...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- History -->
                    <div class="bg-white rounded-lg shadow-md border">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold">Storico Trade Recenti</h3>
                        </div>
                        <div class="p-6">
                            <div id="historyTable" class="overflow-x-auto">
                                <div class="text-center py-4">
                                    <div class="loading-spinner mx-auto mb-2"></div>
                                    <p class="text-gray-500">Caricamento storico...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            // Load performance stats
            const performance = await window.API.getPerformance();
            this.renderPerformanceStats(performance);

            // Load signals
            const signals = await window.API.getTopSignals();
            this.renderSignals(signals.signals || []);

            // Load positions
            const positions = await window.API.listPositions();
            this.renderPositions(positions.positions || []);

            // Load history
            const history = await window.API.listHistory();
            this.renderHistory(history.signals || []);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    renderPerformanceStats(data) {
        const stats = [
            { 
                title: 'Profitto Totale', 
                value: Utils.formatCurrency(data.totalProfitLoss || 0), 
                description: 'Profitto/perdita totale degli ultimi 30 giorni',
                icon: 'dollar-sign',
                color: (data.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            },
            { 
                title: 'Win Rate', 
                value: Utils.formatPercentage(data.winRate || 0), 
                description: 'Percentuale di trade in profitto',
                icon: 'percent',
                color: (data.winRate || 0) >= 70 ? 'text-green-600' : 'text-yellow-600'
            },
            { 
                title: 'Profit Factor', 
                value: (data.profitFactor || 0).toFixed(2), 
                description: 'Rapporto profitto lordo / perdita lorda',
                icon: 'bar-chart',
                color: (data.profitFactor || 0) >= 1.5 ? 'text-green-600' : 'text-yellow-600'
            },
            { 
                title: 'Miglior Trade', 
                value: Utils.formatCurrency(data.bestTrade || 0), 
                description: 'Il trade più profittevole',
                icon: 'trending-up',
                color: 'text-green-600'
            }
        ];

        document.getElementById('performanceStats').innerHTML = stats.map(stat => 
            Components.createStatCard(stat)
        ).join('');

        Components.initializeIcons();
    }

    renderSignals(signals) {
        const signalsGrid = document.getElementById('signalsGrid');
        
        if (signals.length === 0) {
            signalsGrid.innerHTML = `
                <div class="col-span-full bg-white rounded-lg shadow-md border border-dashed border-gray-300 p-8 text-center">
                    <i data-lucide="sparkles" class="h-12 w-12 mx-auto mb-4 text-gray-400"></i>
                    <h4 class="font-semibold mb-2">Sistema in Preparazione</h4>
                    <p class="text-gray-600 mb-4">Il sistema automatico sta generando i primi segnali.</p>
                    ${Components.createButton({ text: '🔄 Genera Ora', variant: 'outline', onclick: 'refreshSignals()' })}
                </div>
            `;
        } else {
            signalsGrid.innerHTML = signals.map(signal => 
                Components.createSignalCard(signal)
            ).join('');
        }

        Components.initializeIcons();
    }

    renderPositions(positions) {
        const container = document.getElementById('positionsTable');
        
        if (positions.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="trending-up" class="h-12 w-12 mx-auto mb-4 text-gray-400"></i>
                    <p class="text-gray-500">Nessuna posizione aperta</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open Price</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${positions.map(position => Components.createPositionRow(position)).join('')}
                    </tbody>
                </table>
            `;
        }

        Components.initializeIcons();
    }

    renderHistory(signals) {
        const container = document.getElementById('historyTable');
        
        if (signals.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="history" class="h-12 w-12 mx-auto mb-4 text-gray-400"></i>
                    <p class="text-gray-500">Nessun trade completato</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direction</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${signals.slice(0, 5).map(signal => Components.createHistoryRow(signal)).join('')}
                    </tbody>
                </table>
            `;
        }

        Components.initializeIcons();
    }

    // ML Dashboard Page
    renderMLDashboardPage() {
        this.renderWithLayout(Pages.renderMLDashboard());
        this.loadMLDashboardData();
    }

    renderTradePage() {
        this.renderWithLayout(Pages.renderTradePage());
    }

    renderNewsPage() {
        this.renderWithLayout(Pages.renderNewsPage());
    }

    renderHistoryPage() {
        this.renderWithLayout(Pages.renderHistoryPage());
        this.loadHistoryData();
    }

    renderGuidesPage() {
        this.renderWithLayout(Pages.renderGuidesPage());
    }

    renderDownloadsPage() {
        this.renderWithLayout(Pages.renderGuidesPage()); // Use guides for now
    }

    renderSettingsPage() {
        this.renderWithLayout(Pages.renderSettingsPage());
        this.loadSettingsData();
    }

    renderBillingPage() {
        this.renderWithLayout(`
            <div class="space-y-6">
                <h1 class="text-3xl font-bold">💳 Billing & Subscription</h1>
                <div class="bg-white rounded-lg shadow-md border p-8 text-center">
                    <i data-lucide="credit-card" class="h-16 w-16 mx-auto mb-4 text-gray-400"></i>
                    <h3 class="text-lg font-semibold mb-2">Demo Account</h3>
                    <p class="text-gray-600 mb-4">You're using a demo account with full access to all features</p>
                    ${Components.createButton({ text: 'Upgrade to Pro', variant: 'primary', onclick: 'Router.navigate("subscribe")' })}
                </div>
            </div>
        `);
        Components.initializeIcons();
    }

    renderMT5SetupPage() {
        this.renderWithLayout(Pages.renderMT5Setup());
    }

    async loadMLDashboardData() {
        try {
            const mlData = await window.API.getMLAnalytics();
            this.renderMLStats(mlData);
            this.renderMLCharts(mlData);
            this.renderModelDetails(mlData);
        } catch (error) {
            console.error('Error loading ML dashboard data:', error);
        }
    }

    renderMLStats(data) {
        const stats = [
            { 
                title: 'ML Accuracy', 
                value: `${((data.modelPerformance?.accuracy || 0) * 100).toFixed(1)}%`, 
                description: 'Accuratezza del modello ML',
                icon: 'brain',
                color: (data.modelPerformance?.accuracy || 0) >= 0.8 ? 'text-green-600' : 'text-yellow-600'
            },
            { 
                title: 'Precision', 
                value: `${((data.modelPerformance?.precision || 0) * 100).toFixed(1)}%`, 
                description: 'Precisione delle predizioni',
                icon: 'target'
            },
            { 
                title: 'F1 Score', 
                value: `${((data.modelPerformance?.f1Score || 0) * 100).toFixed(1)}%`, 
                description: 'Bilanciamento precision/recall',
                icon: 'activity'
            },
            { 
                title: 'Predizioni', 
                value: data.predictionStats?.totalPredictions?.toString() || '0', 
                description: 'Numero totale di predizioni generate',
                icon: 'zap'
            }
        ];

        document.getElementById('mlStats').innerHTML = stats.map(stat => 
            Components.createStatCard(stat)
        ).join('');

        Components.initializeIcons();
    }

    renderMLCharts(data) {
        if (data.performanceTimeline && data.performanceTimeline.length > 0) {
            Charts.createPerformanceChart('performanceChart', data.performanceTimeline);
        }

        if (data.featureImportance && data.featureImportance.length > 0) {
            Charts.createFeatureChart('featureChart', data.featureImportance);
        }
    }

    renderModelDetails(data) {
        const details = `
            <div class="grid gap-6 md:grid-cols-2">
                <div>
                    <h4 class="font-semibold mb-3">📊 Model Metrics</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Accuracy:</span>
                            <span class="font-medium">${((data.modelPerformance?.accuracy || 0) * 100).toFixed(2)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Precision:</span>
                            <span class="font-medium">${((data.modelPerformance?.precision || 0) * 100).toFixed(2)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Recall:</span>
                            <span class="font-medium">${((data.modelPerformance?.recall || 0) * 100).toFixed(2)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>F1 Score:</span>
                            <span class="font-medium">${((data.modelPerformance?.f1Score || 0) * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="font-semibold mb-3">🎯 Prediction Stats</h4>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span>Total Predictions:</span>
                            <span class="font-medium">${data.predictionStats?.totalPredictions || 0}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Correct Predictions:</span>
                            <span class="font-medium">${data.predictionStats?.correctPredictions || 0}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Success Rate:</span>
                            <span class="font-medium">${data.predictionStats?.totalPredictions ? 
                                ((data.predictionStats.correctPredictions / data.predictionStats.totalPredictions) * 100).toFixed(1) 
                                : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modelDetails').innerHTML = details;
    }

    async loadHistoryData() {
        try {
            const history = await window.API.listHistory();
            const performance = await window.API.getPerformance();
            
            this.renderHistorySummary(performance);
            this.renderFullHistory(history.signals || []);
        } catch (error) {
            console.error('Error loading history data:', error);
        }
    }

    renderHistorySummary(data) {
        const stats = [
            { 
                title: 'Total Trades', 
                value: data.totalTrades?.toString() || '0', 
                description: 'Numero totale di trade eseguiti',
                icon: 'bar-chart'
            },
            { 
                title: 'Win Rate', 
                value: `${(data.winRate || 0).toFixed(1)}%`, 
                description: 'Percentuale di successo',
                icon: 'percent',
                color: (data.winRate || 0) >= 70 ? 'text-green-600' : 'text-red-600'
            },
            { 
                title: 'Total Profit', 
                value: Utils.formatCurrency(data.totalProfitLoss || 0), 
                description: 'Profitto totale realizzato',
                icon: 'dollar-sign',
                color: (data.totalProfitLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            },
            { 
                title: 'Avg Trade', 
                value: Utils.formatCurrency(data.avgTradeReturn || 0), 
                description: 'Ritorno medio per trade',
                icon: 'trending-up',
                color: (data.avgTradeReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }
        ];

        document.getElementById('historySummary').innerHTML = stats.map(stat => 
            Components.createStatCard(stat)
        ).join('');

        Components.initializeIcons();
    }

    renderFullHistory(signals) {
        const container = document.getElementById('fullHistoryTable');
        
        if (signals.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="history" class="h-16 w-16 mx-auto mb-4 text-gray-400"></i>
                    <h4 class="font-semibold text-gray-800 mb-2">Nessun trade completato</h4>
                    <p class="text-gray-600">I trade completati appariranno qui</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direction</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${signals.map(signal => Components.createHistoryRow(signal)).join('')}
                    </tbody>
                </table>
            `;
        }

        Components.initializeIcons();
    }

    async loadSettingsData() {
        // Check MT5 status
        try {
            const status = await window.API.getMt5Status();
            const statusContainer = document.getElementById('mt5ConnectionStatus');
            
            if (statusContainer) {
                if (status.connected) {
                    statusContainer.innerHTML = `
                        <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div>
                                    <div class="font-medium text-green-800">MT5 Connected</div>
                                    <div class="text-sm text-green-600">
                                        ${status.accountInfo?.name || 'Demo Account'} | 
                                        Balance: $${status.accountInfo?.balance?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                            </div>
                            ${Components.createButton({ 
                                text: 'Configura MT5', 
                                variant: 'outline',
                                onclick: 'Router.navigate("mt5-setup")'
                            })}
                        </div>
                    `;
                } else {
                    statusContainer.innerHTML = `
                        <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div>
                                    <div class="font-medium text-red-800">MT5 Disconnected</div>
                                    <div class="text-sm text-red-600">MetaTrader 5 not connected</div>
                                </div>
                            </div>
                            ${Components.createButton({ 
                                text: 'Configura MT5', 
                                variant: 'primary',
                                onclick: 'Router.navigate("mt5-setup")'
                            })}
                        </div>
                    `;
                }
                Components.initializeIcons();
            }
        } catch (error) {
            console.error('Error checking MT5 status:', error);
        }
    }

    renderSubscribePage() {
        const content = `
            <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
                <div class="max-w-4xl mx-auto px-4">
                    <div class="text-center mb-12">
                        <h1 class="text-4xl font-bold gradient-text mb-4">Choose Your Plan</h1>
                        <p class="text-xl text-gray-600">Start with our free trial, upgrade anytime</p>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-8">
                        <!-- Free Trial -->
                        <div class="bg-white rounded-lg shadow-lg border p-6 text-center">
                            <h3 class="text-xl font-semibold mb-2">Free Trial</h3>
                            <div class="text-3xl font-bold mb-4">$0<span class="text-sm text-gray-500">/7 days</span></div>
                            <ul class="text-sm text-gray-600 space-y-2 mb-6">
                                <li>• 10 AI signals per day</li>
                                <li>• Basic analytics</li>
                                <li>• Email support</li>
                            </ul>
                            ${Components.createButton({ text: 'Start Free Trial', variant: 'outline', onclick: 'Router.navigate("register")' })}
                        </div>
                        
                        <!-- Pro -->
                        <div class="bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6 text-center transform scale-105">
                            <div class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mb-2">Most Popular</div>
                            <h3 class="text-xl font-semibold mb-2">Pro</h3>
                            <div class="text-3xl font-bold mb-4">$97<span class="text-sm text-gray-500">/month</span></div>
                            <ul class="text-sm text-gray-600 space-y-2 mb-6">
                                <li>• Unlimited AI signals</li>
                                <li>• Auto-trading</li>
                                <li>• Advanced analytics</li>
                                <li>• Priority support</li>
                            </ul>
                            ${Components.createButton({ text: 'Choose Pro', variant: 'primary', onclick: 'Router.navigate("register")' })}
                        </div>
                        
                        <!-- Enterprise -->
                        <div class="bg-white rounded-lg shadow-lg border p-6 text-center">
                            <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
                            <div class="text-3xl font-bold mb-4">$297<span class="text-sm text-gray-500">/month</span></div>
                            <ul class="text-sm text-gray-600 space-y-2 mb-6">
                                <li>• Everything in Pro</li>
                                <li>• Multiple accounts</li>
                                <li>• Custom strategies</li>
                                <li>• Dedicated support</li>
                            </ul>
                            ${Components.createButton({ text: 'Contact Sales', variant: 'outline', onclick: 'Router.navigate("register")' })}
                        </div>
                    </div>
                    
                    <div class="text-center mt-12">
                        <p class="text-gray-600">Already have an account? 
                            <a href="#" onclick="Router.navigate('login')" class="text-blue-600 underline">Sign in</a>
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('content').innerHTML = content;
        Components.initializeIcons();
    }

    renderWithLayout(content) {
        const layout = `
            <div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <!-- Sidebar -->
                <div class="hidden border-r bg-gray-50/40 md:block">
                    <div class="flex h-full max-h-screen flex-col gap-2">
                        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <a href="#" onclick="Router.navigate('dashboard')" class="flex items-center gap-2 font-semibold">
                                <i data-lucide="trending-up" class="h-6 w-6"></i>
                                <span>AI Trading Boost</span>
                            </a>
                        </div>
                        <div class="flex-1 py-4">
                            ${Components.createNavigation()}
                        </div>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="flex flex-col">
                    <!-- Header -->
                    <header class="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-white px-4 lg:px-6">
                        <div class="flex-1">
                            <h2 class="text-lg font-semibold text-gray-900">
                                ${window.AppState.currentUser?.name || 'Demo User'}
                            </h2>
                        </div>
                        <div class="flex items-center gap-4">
                            ${Components.createBadge({ text: 'DEMO', variant: 'warning' })}
                            ${Components.createButton({ 
                                text: 'Logout', 
                                variant: 'ghost',
                                onclick: 'Auth.logout()',
                                icon: 'log-out'
                            })}
                        </div>
                    </header>

                    <!-- Main -->
                    <main class="flex-1 p-4 lg:p-6 bg-gray-50">
                        ${content}
                    </main>
                </div>
            </div>

            <!-- Mobile Bottom Nav -->
            ${Components.createMobileBottomNav()}
        `;

        document.getElementById('content').innerHTML = layout;
        Components.initializeIcons();
    }
}

// Global Router instance
window.Router = new Router();

// Global functions for UI interactions
window.refreshSignals = async () => {
    try {
        await window.API.forceSignalGeneration();
        window.Router.loadDashboardData();
        Utils.showNotification('Segnali aggiornati con successo', 'success');
    } catch (error) {
        Utils.showNotification('Errore nell\'aggiornamento dei segnali', 'error');
    }
};

window.trainAIModel = async () => {
    try {
        await window.API.trainModel({});
        Utils.showNotification('Training AI avviato con successo', 'success');
    } catch (error) {
        Utils.showNotification('Errore nell\'avvio del training', 'error');
    }
};

window.executeSignal = async (tradeId) => {
    try {
        await window.API.executeSignal({ tradeId });
        Utils.showNotification('Segnale eseguito con successo', 'success');
        window.Router.loadDashboardData();
    } catch (error) {
        Utils.showNotification('Errore nell\'esecuzione del segnale', 'error');
    }
};

window.closePosition = async (ticket) => {
    if (confirm('Sei sicuro di voler chiudere questa posizione?')) {
        try {
            await window.API.closePosition(ticket, {});
            Utils.showNotification('Posizione chiusa con successo', 'success');
            window.Router.loadDashboardData();
        } catch (error) {
            Utils.showNotification('Errore nella chiusura della posizione', 'error');
        }
    }
};

console.log('🚀 Router initialized');