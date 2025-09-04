// UI Components Library
class Components {
    
    // Create card component
    static createCard({ title, content, footer, className = '' }) {
        return `
            <div class="bg-white rounded-lg shadow-md border ${className}">
                ${title ? `
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
                    </div>
                ` : ''}
                <div class="px-6 py-4">
                    ${content}
                </div>
                ${footer ? `
                    <div class="px-6 py-4 border-t border-gray-200">
                        ${footer}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Create button component
    static createButton({ text, variant = 'primary', size = 'medium', onclick = '', disabled = false, icon = '' }) {
        const variants = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
            success: 'bg-green-600 hover:bg-green-700 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
            outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
            ghost: 'text-gray-600 hover:bg-gray-100'
        };

        const sizes = {
            small: 'px-3 py-1.5 text-sm',
            medium: 'px-4 py-2 text-base',
            large: 'px-6 py-3 text-lg'
        };

        return `
            <button 
                class="inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}"
                onclick="${onclick}"
                ${disabled ? 'disabled' : ''}
            >
                ${icon ? `<i data-lucide="${icon}" class="w-4 h-4 mr-2"></i>` : ''}
                ${text}
            </button>
        `;
    }

    // Create badge component
    static createBadge({ text, variant = 'default', size = 'medium' }) {
        const variants = {
            default: 'bg-gray-100 text-gray-800',
            primary: 'bg-blue-100 text-blue-800',
            success: 'bg-green-100 text-green-800',
            warning: 'bg-yellow-100 text-yellow-800',
            danger: 'bg-red-100 text-red-800'
        };

        const sizes = {
            small: 'px-2 py-0.5 text-xs',
            medium: 'px-2.5 py-0.5 text-sm',
            large: 'px-3 py-1 text-base'
        };

        return `
            <span class="inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}">
                ${text}
            </span>
        `;
    }

    // Create signal card
    static createSignalCard(signal) {
        const isLong = signal.direction === 'LONG';
        const confidenceColor = Utils.getConfidenceColor(signal.confidence);
        const directionColor = Utils.getDirectionColor(signal.direction);

        return `
            <div class="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow card-hover">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2">
                            <i data-lucide="${isLong ? 'trending-up' : 'trending-down'}" class="w-6 h-6 ${directionColor}"></i>
                            <h3 class="font-semibold text-lg">${signal.symbol}</h3>
                        </div>
                        ${Components.createBadge({ 
                            text: signal.direction, 
                            variant: isLong ? 'success' : 'danger' 
                        })}
                    </div>

                    <!-- Confidence -->
                    <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50 mb-4">
                        <div class="flex items-center gap-2">
                            <i data-lucide="zap" class="w-5 h-5 text-blue-600"></i>
                            <span class="font-medium">Confidenza</span>
                        </div>
                        <span class="${confidenceColor} text-white px-3 py-1 rounded-full font-bold">
                            ${signal.confidence}%
                        </span>
                    </div>

                    <!-- Price Info -->
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center">
                            <div class="text-sm text-gray-500">Entry</div>
                            <div class="font-semibold">${signal.entryPrice.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm text-gray-500">Stop Loss</div>
                            <div class="font-semibold text-red-600">${signal.stopLoss.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-sm text-gray-500">Take Profit</div>
                            <div class="font-semibold text-green-600">${signal.takeProfit.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}</div>
                        </div>
                    </div>

                    <!-- Analysis -->
                    ${signal.analysis ? `
                        <div class="p-3 bg-blue-50 rounded-lg mb-4">
                            <div class="flex items-start gap-2">
                                <i data-lucide="brain" class="w-4 h-4 text-blue-600 mt-0.5"></i>
                                <p class="text-sm text-blue-800">${signal.analysis}</p>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Actions -->
                    <div class="flex gap-2">
                        ${Components.createButton({ 
                            text: 'Execute Trade', 
                            variant: 'primary', 
                            onclick: `executeSignal('${signal.tradeId}')`,
                            icon: 'play'
                        })}
                        ${Components.createButton({ 
                            text: 'Details', 
                            variant: 'outline', 
                            onclick: `showSignalDetails('${signal.tradeId}')`,
                            icon: 'eye'
                        })}
                    </div>

                    <!-- Timestamp -->
                    <div class="mt-3 text-xs text-gray-500 flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3"></i>
                        ${Utils.timeAgo(signal.timestamp)}
                    </div>
                </div>
            </div>
        `;
    }

    // Create stat card
    static createStatCard({ title, value, description, icon, color = 'text-gray-600' }) {
        return `
            <div class="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow card-hover">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-gray-500">${title}</h3>
                    <i data-lucide="${icon}" class="w-5 h-5 text-gray-400"></i>
                </div>
                <div class="text-2xl font-bold ${color} mb-1">${value}</div>
                <p class="text-xs text-gray-500">${description}</p>
            </div>
        `;
    }

    // Create position row
    static createPositionRow(position) {
        const profitColor = Utils.getProfitColor(position.profit);
        const typeColor = position.type === 'LONG' ? 'text-green-600' : 'text-red-600';

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i data-lucide="${position.type === 'LONG' ? 'trending-up' : 'trending-down'}" class="w-4 h-4 ${typeColor} mr-2"></i>
                        <span class="font-medium">${position.symbol}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${typeColor} font-medium">${position.type}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${position.volume}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${position.openPrice.toFixed(position.symbol.includes('JPY') ? 3 : 5)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${position.currentPrice.toFixed(position.symbol.includes('JPY') ? 3 : 5)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${profitColor} font-medium">
                        ${Utils.formatCurrency(position.profit)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${Utils.timeAgo(position.openTime)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    ${Components.createButton({ 
                        text: 'Close', 
                        variant: 'danger',
                        size: 'small',
                        onclick: `closePosition('${position.ticket}')`
                    })}
                </td>
            </tr>
        `;
    }

    // Create history row
    static createHistoryRow(signal) {
        const profitColor = Utils.getProfitColor(signal.profit);
        const directionColor = Utils.getDirectionColor(signal.direction);

        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <i data-lucide="${signal.direction === 'LONG' ? 'trending-up' : 'trending-down'}" class="w-4 h-4 ${directionColor} mr-2"></i>
                        <span class="font-medium">${signal.symbol}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${directionColor} font-medium">${signal.direction}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${signal.entryPrice.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${signal.exitPrice.toFixed(signal.symbol.includes('JPY') ? 3 : 5)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${profitColor} font-medium">
                        ${Utils.formatCurrency(signal.profit)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${Utils.formatDate(signal.openTime)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${Components.createBadge({ 
                        text: signal.status, 
                        variant: signal.profit >= 0 ? 'success' : 'danger' 
                    })}
                </td>
            </tr>
        `;
    }

    // Create loading skeleton
    static createLoadingSkeleton(type = 'card') {
        if (type === 'card') {
            return `
                <div class="bg-white rounded-lg shadow-md border p-6">
                    <div class="animate-pulse">
                        <div class="flex items-center justify-between mb-4">
                            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div class="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div class="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div class="space-y-2">
                            <div class="h-4 bg-gray-200 rounded"></div>
                            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (type === 'table-row') {
            return `
                <tr class="animate-pulse">
                    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded"></div></td>
                </tr>
            `;
        }

        return `<div class="animate-pulse h-4 bg-gray-200 rounded"></div>`;
    }

    // Create navigation
    static createNavigation() {
        const navItems = [
            { path: 'dashboard', icon: 'home', label: 'Dashboard' },
            { path: 'ml-dashboard', icon: 'brain', label: 'ML Analytics', badge: 'AI' },
            { path: 'trade', icon: 'trending-up', label: 'Trading' },
            { path: 'news', icon: 'newspaper', label: 'News' },
            { path: 'history', icon: 'history', label: 'Storico' },
            { path: 'guides', icon: 'book-open', label: 'Guide', badge: 'NEW' },
            { path: 'downloads', icon: 'download', label: 'Download MT5', badge: 'SETUP' },
            { path: 'settings', icon: 'settings', label: 'Impostazioni' },
            { path: 'billing', icon: 'credit-card', label: 'Abbonamento' }
        ];

        return `
            <nav class="space-y-1 px-2">
                ${navItems.map(item => `
                    <a href="#" onclick="Router.navigate('${item.path}')" 
                       class="nav-item group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${window.AppState.currentPage === item.path ? 'bg-gray-100 text-gray-900' : ''}">
                        <i data-lucide="${item.icon}" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"></i>
                        ${item.label}
                        ${item.badge ? `
                            <span class="ml-auto inline-block py-0.5 px-2 text-xs rounded-full ${item.badge === 'AI' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                                ${item.badge}
                            </span>
                        ` : ''}
                    </a>
                `).join('')}
                
                <!-- Logout -->
                <div class="border-t border-gray-200 pt-4 mt-4">
                    <a href="#" onclick="Auth.logout()" class="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50">
                        <i data-lucide="log-out" class="mr-3 h-5 w-5"></i>
                        Logout
                    </a>
                </div>
            </nav>
        `;
    }

    // Create mobile bottom navigation
    static createMobileBottomNav() {
        const mobileNavItems = [
            { path: 'dashboard', icon: 'home', label: 'Dashboard' },
            { path: 'trade', icon: 'trending-up', label: 'Trade' },
            { path: 'ml-dashboard', icon: 'brain', label: 'ML' },
            { path: 'history', icon: 'history', label: 'History' }
        ];

        return `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-40">
                <div class="flex justify-around">
                    ${mobileNavItems.map(item => `
                        <button onclick="Router.navigate('${item.path}')" 
                                class="flex flex-col items-center py-2 px-3 text-xs ${window.AppState.currentPage === item.path ? 'text-blue-600' : 'text-gray-500'}">
                            <i data-lucide="${item.icon}" class="h-6 w-6 mb-1"></i>
                            ${item.label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Initialize icons
    static initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// Global Components instance
window.Components = Components;

console.log('🧩 Components library loaded');