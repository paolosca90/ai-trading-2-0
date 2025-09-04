// Main Application Entry Point
class App {
    constructor() {
        this.initializeApp();
    }

    async initializeApp() {
        // Show loading screen
        this.showLoading(true);

        try {
            // Initialize core systems
            await this.setupEventListeners();
            await this.initializeAuth();
            
            // Hide loading screen
            setTimeout(() => {
                this.showLoading(false);
                console.log('🚀 AI Trading Boost 2.0 - Application loaded successfully');
            }, 1500); // Show loading for at least 1.5 seconds for better UX

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }

    showLoading(show) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-4 text-red-500">
                        <i data-lucide="alert-circle" class="w-full h-full"></i>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">Application Error</h1>
                    <p class="text-gray-600 mb-4">${message}</p>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Reload Page
                    </button>
                </div>
            </div>
        `;
        Components.initializeIcons();
    }

    async setupEventListeners() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        // Global unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
        });

        // Listen for state changes
        window.addEventListener('stateChanged', (event) => {
            this.handleStateChange(event.detail);
        });

        // Listen for online/offline status
        window.addEventListener('online', () => {
            Utils.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showNotification('Connection lost - working offline', 'warning');
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Handle visibility change for real-time updates
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Setup auto-refresh intervals
        this.setupAutoRefresh();
    }

    async initializeAuth() {
        // Auth manager will handle this automatically
        // Just wait for it to complete
        while (window.AppState.authLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    handleStateChange(changes) {
        // Update UI based on state changes
        if (changes.hasOwnProperty('isAuthenticated')) {
            this.updateAuthUI(changes.isAuthenticated);
        }

        if (changes.hasOwnProperty('currentPage')) {
            this.updatePageTitle(changes.currentPage);
            this.updateNavigation(changes.currentPage);
        }

        if (changes.hasOwnProperty('mt5Connected')) {
            this.updateMT5Status(changes.mt5Connected);
        }
    }

    updateAuthUI(isAuthenticated) {
        // Update any global authentication UI elements
        const authElements = document.querySelectorAll('[data-auth-required]');
        authElements.forEach(element => {
            element.style.display = isAuthenticated ? 'block' : 'none';
        });
    }

    updatePageTitle(currentPage) {
        const pageTitles = {
            'landing': 'AI Trading Boost 2.0 - Advanced Trading Platform',
            'login': 'Sign In - AI Trading Boost 2.0',
            'register': 'Create Account - AI Trading Boost 2.0',
            'dashboard': 'Dashboard - AI Trading Boost 2.0',
            'ml-dashboard': 'ML Analytics - AI Trading Boost 2.0',
            'trade': 'Trading - AI Trading Boost 2.0',
            'news': 'Market News - AI Trading Boost 2.0',
            'history': 'Trading History - AI Trading Boost 2.0',
            'guides': 'Trading Guides - AI Trading Boost 2.0',
            'downloads': 'Downloads - AI Trading Boost 2.0',
            'settings': 'Settings - AI Trading Boost 2.0',
            'billing': 'Billing - AI Trading Boost 2.0',
            'mt5-setup': 'MT5 Setup - AI Trading Boost 2.0',
            'subscribe': 'Subscribe - AI Trading Boost 2.0'
        };

        document.title = pageTitles[currentPage] || 'AI Trading Boost 2.0';
    }

    updateNavigation(currentPage) {
        // Update active navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const href = item.getAttribute('onclick');
            if (href && href.includes(currentPage)) {
                item.classList.add('bg-gray-100', 'text-gray-900');
                item.classList.remove('text-gray-600');
            } else {
                item.classList.remove('bg-gray-100', 'text-gray-900');
                item.classList.add('text-gray-600');
            }
        });
    }

    updateMT5Status(connected) {
        // Update MT5 status indicators
        const mt5StatusElements = document.querySelectorAll('[data-mt5-status]');
        mt5StatusElements.forEach(element => {
            element.textContent = connected ? 'Connected' : 'Disconnected';
            element.className = connected ? 'text-green-600' : 'text-red-600';
        });
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + K for quick search/navigation
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            this.showQuickNavigation();
        }

        // Escape to close modals
        if (event.key === 'Escape') {
            this.closeModals();
        }

        // Quick page navigation shortcuts
        if (window.AppState.isAuthenticated && event.altKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    Router.navigate('dashboard');
                    break;
                case '2':
                    event.preventDefault();
                    Router.navigate('trade');
                    break;
                case '3':
                    event.preventDefault();
                    Router.navigate('ml-dashboard');
                    break;
                case '4':
                    event.preventDefault();
                    Router.navigate('history');
                    break;
            }
        }
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Page became visible, resume updates
            this.resumeAutoRefresh();
        } else {
            // Page became hidden, pause updates to save resources
            this.pauseAutoRefresh();
        }
    }

    setupAutoRefresh() {
        this.autoRefreshIntervals = [];

        if (window.AppState.isAuthenticated) {
            // Dashboard data refresh
            const dashboardRefresh = setInterval(() => {
                if (window.AppState.currentPage === 'dashboard' && document.visibilityState === 'visible') {
                    this.refreshDashboardData();
                }
            }, window.AppConfig.REFRESH_INTERVALS.SIGNALS);

            this.autoRefreshIntervals.push(dashboardRefresh);

            // MT5 status refresh
            const mt5StatusRefresh = setInterval(() => {
                if (window.AppState.isAuthenticated && document.visibilityState === 'visible') {
                    this.refreshMT5Status();
                }
            }, window.AppConfig.REFRESH_INTERVALS.MT5_STATUS);

            this.autoRefreshIntervals.push(mt5StatusRefresh);
        }
    }

    pauseAutoRefresh() {
        // Clear intervals when page is not visible
        this.autoRefreshIntervals.forEach(interval => clearInterval(interval));
        this.autoRefreshIntervals = [];
    }

    resumeAutoRefresh() {
        // Restart intervals when page becomes visible
        this.pauseAutoRefresh();
        this.setupAutoRefresh();
    }

    async refreshDashboardData() {
        try {
            if (window.Router && typeof window.Router.loadDashboardData === 'function') {
                await window.Router.loadDashboardData();
            }
        } catch (error) {
            console.warn('Failed to refresh dashboard data:', error);
        }
    }

    async refreshMT5Status() {
        try {
            const status = await window.API.getMt5Status();
            window.AppState.setState({ 
                mt5Connected: status.connected,
                mt5Status: status
            });
        } catch (error) {
            console.warn('Failed to refresh MT5 status:', error);
        }
    }

    showQuickNavigation() {
        // Simple quick navigation modal
        const modal = document.createElement('div');
        modal.id = 'quick-nav-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-semibold mb-4">Quick Navigation</h3>
                <div class="space-y-2">
                    <button onclick="Router.navigate('dashboard'); App.closeModals()" class="w-full text-left p-2 hover:bg-gray-100 rounded">📊 Dashboard</button>
                    <button onclick="Router.navigate('trade'); App.closeModals()" class="w-full text-left p-2 hover:bg-gray-100 rounded">📈 Trading</button>
                    <button onclick="Router.navigate('ml-dashboard'); App.closeModals()" class="w-full text-left p-2 hover:bg-gray-100 rounded">🤖 ML Analytics</button>
                    <button onclick="Router.navigate('history'); App.closeModals()" class="w-full text-left p-2 hover:bg-gray-100 rounded">📚 History</button>
                </div>
                <div class="mt-4 text-right">
                    <button onclick="App.closeModals()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModals();
            }
        });
    }

    closeModals() {
        const modals = document.querySelectorAll('#quick-nav-modal');
        modals.forEach(modal => {
            modal.remove();
        });
    }

    // Service Worker registration for offline functionality
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    // Analytics tracking (placeholder)
    trackPageView(page) {
        // Placeholder for analytics tracking
        console.log(`Page view: ${page}`);
    }

    trackEvent(category, action, label) {
        // Placeholder for event tracking
        console.log(`Event: ${category} - ${action} - ${label}`);
    }
}

// Global App instance and initialize
window.App = new App();

// Expose closeModals globally for onclick handlers
window.App.closeModals = window.App.closeModals.bind(window.App);

// Error boundary for unhandled errors
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { message, source, lineno, colno, error });
    return false; // Let the default error handler run as well
};

// Enhanced error handling for promises
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
});

console.log('🚀 AI Trading Boost 2.0 - Application initialized');