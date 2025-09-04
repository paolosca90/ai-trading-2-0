// Utility Functions
class Utils {
    // Format currency
    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Format percentage
    static formatPercentage(value, decimals = 1) {
        return `${value.toFixed(decimals)}%`;
    }

    // Format large numbers
    static formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Format time ago
    static timeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    // Format date
    static formatDate(timestamp, options = {}) {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        });
    }

    // Format time
    static formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Generate random ID
    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Debounce function
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // Throttle function
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Deep clone object
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Check if mobile device
    static isMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Animate number counter
    static animateNumber(element, start, end, duration = 1000) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current * 100) / 100;
        }, 16);
    }

    // Create loading spinner
    static createSpinner(size = 'medium') {
        const sizeClasses = {
            small: 'w-4 h-4',
            medium: 'w-8 h-8',
            large: 'w-12 h-12'
        };

        const spinner = document.createElement('div');
        spinner.className = `animate-spin ${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full`;
        return spinner;
    }

    // Show notification
    static showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-black' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current opacity-75 hover:opacity-100">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.parentElement.removeChild(notification);
                    }
                }, 300);
            }, duration);
        }

        return notification;
    }

    // Validate email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password
    static isValidPassword(password) {
        return password.length >= 8;
    }

    // Calculate lot size based on risk
    static calculateLotSize(symbol, entryPrice, stopLoss, riskAmount) {
        const stopLossDistance = Math.abs(entryPrice - stopLoss);
        
        // Estimate pip value based on symbol type
        let pipValue = 1;
        
        if (symbol.includes("JPY")) {
            pipValue = 10;
        } else if (symbol.includes("USD") || symbol.startsWith("EUR") || symbol.startsWith("GBP")) {
            pipValue = 10;
        } else if (symbol === "XAUUSD") {
            pipValue = 1;
        } else if (symbol.includes("BTC") || symbol.includes("ETH")) {
            pipValue = 1;
        } else {
            pipValue = 10;
        }
        
        // Calculate pips in stop loss distance
        let pipsInStopLoss;
        if (symbol.includes("JPY")) {
            pipsInStopLoss = stopLossDistance * 100;
        } else if (symbol.includes("USD") || symbol.startsWith("EUR") || symbol.startsWith("GBP")) {
            pipsInStopLoss = stopLossDistance * 10000;
        } else {
            pipsInStopLoss = stopLossDistance;
        }
        
        // Calculate lot size
        const lotSize = riskAmount / (pipsInStopLoss * pipValue);
        return Math.max(0.01, Math.round(lotSize * 100) / 100);
    }

    // Get confidence color
    static getConfidenceColor(confidence) {
        if (confidence >= 85) return 'bg-green-500';
        if (confidence >= 75) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    // Get direction color
    static getDirectionColor(direction) {
        return direction === 'LONG' ? 'text-green-500' : 'text-red-500';
    }

    // Get profit color
    static getProfitColor(value) {
        return value >= 0 ? 'text-green-500' : 'text-red-500';
    }

    // Create icon element
    static createIcon(iconName, className = 'w-5 h-5') {
        const icon = document.createElement('div');
        icon.className = className;
        icon.setAttribute('data-lucide', iconName);
        return icon;
    }

    // Escape HTML
    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }

    // Parse query parameters
    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    }

    // Update query parameters
    static updateQueryParams(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    }

    // Storage helpers
    static setStorageItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getStorageItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    }

    static removeStorageItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
}

// Global Utils instance
window.Utils = Utils;

console.log('🔧 Utilities loaded');