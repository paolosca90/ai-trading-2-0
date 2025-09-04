// Mobile-specific functionality
class Mobile {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.setupMobileFeatures();
    }

    detectMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    setupMobileFeatures() {
        if (this.isMobile) {
            this.setupSwipeGestures();
            this.setupPullToRefresh();
            this.setupTouchOptimizations();
            this.hideMobileAddressBar();
        }

        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });

        // Listen for resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.isMobile = this.detectMobile();
            this.handleResize();
        }, 300));
    }

    setupSwipeGestures() {
        let startX, startY, distX, distY;
        const threshold = 100; // Minimum distance to trigger swipe
        const restraint = 100; // Maximum perpendicular distance

        document.addEventListener('touchstart', (e) => {
            const touch = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
        });

        document.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            distX = touch.pageX - startX;
            distY = touch.pageY - startY;

            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    handleSwipeRight() {
        // Navigate to previous page or open sidebar
        if (window.AppState.currentPage !== 'landing') {
            this.navigateToPreviousPage();
        }
    }

    handleSwipeLeft() {
        // Navigate to next page or close sidebar
        if (window.AppState.currentPage !== 'landing') {
            this.navigateToNextPage();
        }
    }

    navigateToPreviousPage() {
        const pages = ['dashboard', 'trade', 'ml-dashboard', 'history', 'settings'];
        const currentIndex = pages.indexOf(window.AppState.currentPage);
        
        if (currentIndex > 0) {
            Router.navigate(pages[currentIndex - 1]);
        }
    }

    navigateToNextPage() {
        const pages = ['dashboard', 'trade', 'ml-dashboard', 'history', 'settings'];
        const currentIndex = pages.indexOf(window.AppState.currentPage);
        
        if (currentIndex >= 0 && currentIndex < pages.length - 1) {
            Router.navigate(pages[currentIndex + 1]);
        }
    }

    setupPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        const pullThreshold = 80;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY) {
                pullDistance = e.touches[0].clientY - startY;
                
                if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
                    // Show pull indicator
                    this.showPullIndicator(pullDistance);
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (pullDistance > pullThreshold) {
                this.triggerRefresh();
            }
            this.hidePullIndicator();
            startY = 0;
            pullDistance = 0;
        });
    }

    showPullIndicator(distance) {
        let indicator = document.getElementById('pullIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pullIndicator';
            indicator.className = 'fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 transform transition-transform duration-300';
            indicator.innerHTML = '<i data-lucide="refresh-cw" class="inline w-4 h-4 mr-2"></i>Pull to refresh';
            document.body.appendChild(indicator);
        }

        const progress = Math.min(distance / 80, 1);
        indicator.style.transform = `translateY(${-100 + (progress * 100)}%)`;
        
        if (distance > 80) {
            indicator.innerHTML = '<i data-lucide="refresh-cw" class="inline w-4 h-4 mr-2 animate-spin"></i>Release to refresh';
            indicator.className = indicator.className.replace('bg-blue-500', 'bg-green-500');
        }

        Components.initializeIcons();
    }

    hidePullIndicator() {
        const indicator = document.getElementById('pullIndicator');
        if (indicator) {
            indicator.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (indicator.parentElement) {
                    indicator.parentElement.removeChild(indicator);
                }
            }, 300);
        }
    }

    async triggerRefresh() {
        Utils.showNotification('Refreshing...', 'info', 2000);
        
        // Refresh current page data
        try {
            if (window.AppState.currentPage === 'dashboard' && window.Router.loadDashboardData) {
                await window.Router.loadDashboardData();
            } else if (window.AppState.currentPage === 'ml-dashboard' && window.Router.loadMLDashboardData) {
                await window.Router.loadMLDashboardData();
            } else if (window.AppState.currentPage === 'history' && window.Router.loadHistoryData) {
                await window.Router.loadHistoryData();
            }
            Utils.showNotification('Refreshed successfully', 'success');
        } catch (error) {
            Utils.showNotification('Refresh failed', 'error');
        }
    }

    setupTouchOptimizations() {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Improve touch targets
        const buttons = document.querySelectorAll('button, a, [onclick]');
        buttons.forEach(button => {
            if (button.offsetHeight < 44 || button.offsetWidth < 44) {
                button.style.minHeight = '44px';
                button.style.minWidth = '44px';
            }
        });

        // Add touch feedback
        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.onclick) {
                e.target.style.opacity = '0.7';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.onclick) {
                setTimeout(() => {
                    e.target.style.opacity = '1';
                }, 150);
            }
        });
    }

    hideMobileAddressBar() {
        // Hide address bar on mobile browsers
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 0);
    }

    handleOrientationChange() {
        // Recalculate dimensions and layouts
        this.isMobile = this.detectMobile();
        
        // Update any orientation-specific UI
        if (window.innerHeight > window.innerWidth) {
            // Portrait
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        } else {
            // Landscape
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        }

        // Re-render charts if they exist
        this.refreshChartsOnOrientationChange();
    }

    handleResize() {
        // Update mobile status
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        // If changed from/to mobile, update UI
        if (wasMobile !== this.isMobile) {
            this.updateUIForDeviceType();
        }
    }

    updateUIForDeviceType() {
        const mobileNav = document.querySelector('.md\\:hidden');
        const desktopNav = document.querySelector('.hidden.md\\:block');
        
        if (this.isMobile) {
            // Show mobile navigation
            if (mobileNav) mobileNav.style.display = 'block';
            if (desktopNav) desktopNav.style.display = 'none';
        } else {
            // Show desktop navigation
            if (mobileNav) mobileNav.style.display = 'none';
            if (desktopNav) desktopNav.style.display = 'block';
        }
    }

    refreshChartsOnOrientationChange() {
        // Re-render charts to fit new dimensions
        setTimeout(() => {
            const charts = document.querySelectorAll('canvas');
            charts.forEach(canvas => {
                if (canvas.chart && typeof canvas.chart.resize === 'function') {
                    canvas.chart.resize();
                }
            });
        }, 300);
    }

    // Mobile-specific dashboard layout
    createMobileDashboard() {
        if (!this.isMobile) return null;

        return `
            <div class="space-y-4">
                <!-- Mobile Quick Stats -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg text-white">
                        <div class="text-sm opacity-90">Portfolio</div>
                        <div class="text-xl font-bold">$12,847</div>
                        <div class="text-xs opacity-75">+2.4% today</div>
                    </div>
                    <div class="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-lg text-white">
                        <div class="text-sm opacity-90">Win Rate</div>
                        <div class="text-xl font-bold">78.5%</div>
                        <div class="text-xs opacity-75">Last 30 days</div>
                    </div>
                </div>

                <!-- Active Signals -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="p-4 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold">🎯 Active Signals</h3>
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">3 Active</span>
                        </div>
                    </div>
                    <div class="p-4 space-y-3" id="mobileSignals">
                        <!-- Signals will be loaded here -->
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-3 gap-3">
                    <button onclick="Router.navigate('trade')" class="bg-white p-4 rounded-lg shadow-md border text-center">
                        <i data-lucide="trending-up" class="h-6 w-6 mx-auto mb-2 text-blue-600"></i>
                        <div class="text-sm font-medium">Trade</div>
                    </button>
                    <button onclick="Router.navigate('ml-dashboard')" class="bg-white p-4 rounded-lg shadow-md border text-center">
                        <i data-lucide="brain" class="h-6 w-6 mx-auto mb-2 text-purple-600"></i>
                        <div class="text-sm font-medium">AI</div>
                    </button>
                    <button onclick="Router.navigate('history')" class="bg-white p-4 rounded-lg shadow-md border text-center">
                        <i data-lucide="history" class="h-6 w-6 mx-auto mb-2 text-green-600"></i>
                        <div class="text-sm font-medium">History</div>
                    </button>
                </div>
            </div>
        `;
    }

    // Mobile-specific signal card
    createMobileSignalCard(signal) {
        const isLong = signal.direction === 'LONG';
        const confidenceColor = Utils.getConfidenceColor(signal.confidence);

        return `
            <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <i data-lucide="${isLong ? 'trending-up' : 'trending-down'}" 
                           class="w-4 h-4 ${Utils.getDirectionColor(signal.direction)}"></i>
                        <span class="font-medium">${signal.symbol}</span>
                    </div>
                    <span class="${confidenceColor} text-white text-xs px-2 py-1 rounded-full">
                        ${signal.confidence}%
                    </span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Entry: ${signal.entryPrice.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</span>
                    <span class="text-green-600">TP: ${signal.takeProfit.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="executeSignal('${signal.tradeId}')" 
                            class="flex-1 bg-blue-600 text-white text-sm py-2 rounded font-medium">
                        Execute
                    </button>
                    <button onclick="showSignalDetails('${signal.tradeId}')" 
                            class="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded">
                        Details
                    </button>
                </div>
            </div>
        `;
    }

    // Show mobile notification
    showMobileNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-20 left-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current opacity-75">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 3000);

        Components.initializeIcons();
        return notification;
    }

    // Enable mobile keyboard optimization
    setupKeyboardOptimization() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Scroll to input when keyboard appears
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });

            // Add appropriate input types for mobile
            if (input.type === 'text') {
                if (input.name?.includes('email') || input.placeholder?.includes('email')) {
                    input.type = 'email';
                } else if (input.name?.includes('phone') || input.placeholder?.includes('phone')) {
                    input.type = 'tel';
                } else if (input.name?.includes('number') || input.placeholder?.includes('amount')) {
                    input.type = 'number';
                    input.inputMode = 'decimal';
                }
            }
        });
    }
}

// Global Mobile instance
window.MobileHandler = new Mobile();

// Global functions for mobile interactions
window.showSignalDetails = (tradeId) => {
    // Show detailed signal modal optimized for mobile
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-end z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-t-2xl w-full max-h-96 overflow-y-auto">
            <div class="p-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Signal Details</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            class="text-gray-400 hover:text-gray-600">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
            </div>
            <div class="p-4">
                <p class="text-gray-600 mb-4">Detailed analysis for trade ID: ${tradeId}</p>
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span>Trade ID:</span>
                        <span class="font-medium">${tradeId}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Status:</span>
                        <span class="font-medium text-green-600">Active</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Risk/Reward:</span>
                        <span class="font-medium">1:2.5</span>
                    </div>
                </div>
                <div class="mt-6 flex gap-3">
                    <button onclick="executeSignal('${tradeId}'); this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium">
                        Execute Trade
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.parentElement.remove()" 
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    Components.initializeIcons();
};

console.log('📱 Mobile handler loaded');