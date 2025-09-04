// Additional Page Implementations
class Pages {
    
    // ML Dashboard Page
    static renderMLDashboard() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">🤖 Machine Learning Analytics</h1>
                        <p class="text-gray-600">Performance dei modelli AI e analisi predittive</p>
                    </div>
                    <div class="flex gap-2">
                        ${Components.createButton({ 
                            text: '🧠 Train Model', 
                            variant: 'primary',
                            onclick: 'trainAIModel()'
                        })}
                        ${Components.createButton({ 
                            text: '🔍 Detect Patterns', 
                            variant: 'outline',
                            onclick: 'detectPatterns()'
                        })}
                    </div>
                </div>

                <!-- ML Performance Stats -->
                <div id="mlStats" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    ${Array.from({ length: 4 }, () => Components.createLoadingSkeleton('card')).join('')}
                </div>

                <!-- Charts Section -->
                <div class="grid gap-6 md:grid-cols-2">
                    <!-- Performance Timeline -->
                    <div class="bg-white rounded-lg shadow-md border">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold">📈 Andamento Performance ML</h3>
                        </div>
                        <div class="p-6">
                            <canvas id="performanceChart" width="400" height="200"></canvas>
                        </div>
                    </div>

                    <!-- Feature Importance -->
                    <div class="bg-white rounded-lg shadow-md border">
                        <div class="px-6 py-4 border-b border-gray-200">
                            <h3 class="text-lg font-semibold">🎯 Importanza Features</h3>
                        </div>
                        <div class="p-6">
                            <canvas id="featureChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Model Details -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">🔬 Dettagli Modello</h3>
                    </div>
                    <div class="p-6" id="modelDetails">
                        <div class="text-center py-8">
                            <div class="loading-spinner mx-auto mb-2"></div>
                            <p class="text-gray-500">Caricamento dettagli modello...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Trading Page
    static renderTradePage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">📈 Trading Interface</h1>
                        <p class="text-gray-600">Genera segnali personalizzati e gestisci le tue operazioni</p>
                    </div>
                </div>

                <!-- Trading Form -->
                <div class="grid gap-6 lg:grid-cols-3">
                    <!-- Signal Generation -->
                    <div class="bg-white rounded-lg shadow-md border p-6">
                        <h3 class="text-lg font-semibold mb-4">🎯 Genera Segnale</h3>
                        <form id="signalForm" class="space-y-4">
                            <!-- Symbol Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Asset</label>
                                <select id="symbolSelect" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <optgroup label="🔥 Popolari">
                                        <option value="BTCUSD">BTCUSD</option>
                                        <option value="ETHUSD">ETHUSD</option>
                                        <option value="EURUSD">EURUSD</option>
                                        <option value="GBPUSD">GBPUSD</option>
                                        <option value="XAUUSD">XAUUSD</option>
                                        <option value="US500" selected>US500</option>
                                    </optgroup>
                                    <optgroup label="💱 Forex">
                                        <option value="USDJPY">USDJPY</option>
                                        <option value="USDCHF">USDCHF</option>
                                        <option value="AUDUSD">AUDUSD</option>
                                    </optgroup>
                                </select>
                            </div>

                            <!-- Strategy Selection -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Strategia</label>
                                <select id="strategySelect" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                    <option value="auto">🤖 Strategia Automatica</option>
                                    <option value="scalping">⚡ Scalping</option>
                                    <option value="intraday">📊 Intraday</option>
                                </select>
                            </div>

                            <!-- Generate Button -->
                            ${Components.createButton({ 
                                text: '🚀 Genera Segnale', 
                                variant: 'primary',
                                onclick: 'generateCustomSignal()'
                            })}
                        </form>
                    </div>

                    <!-- Generated Signal -->
                    <div class="lg:col-span-2">
                        <div id="generatedSignal" class="bg-white rounded-lg shadow-md border p-6">
                            <div class="text-center py-12">
                                <i data-lucide="zap" class="h-16 w-16 mx-auto mb-4 text-gray-400"></i>
                                <h3 class="text-lg font-semibold text-gray-800 mb-2">Pronto per generare un segnale</h3>
                                <p class="text-gray-600">Seleziona asset e strategia, poi clicca "Genera Segnale"</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Asset Categories -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">📊 Asset Disponibili</h3>
                    </div>
                    <div class="p-6">
                        <div id="assetCategories" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            ${this.renderAssetCategories()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderAssetCategories() {
        return Object.entries(window.AppConfig.ASSET_CATEGORIES).map(([category, assets]) => `
            <div>
                <h4 class="font-semibold text-gray-800 mb-2">${category}</h4>
                <div class="space-y-1">
                    ${assets.slice(0, 8).map(asset => `
                        <button onclick="selectAsset('${asset}')" class="block w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors">
                            ${asset}
                        </button>
                    `).join('')}
                    ${assets.length > 8 ? `<p class="text-xs text-gray-500 px-3">+${assets.length - 8} more</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    // News Page
    static renderNewsPage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">📰 Market News & Analysis</h1>
                        <p class="text-gray-600">Ultime notizie di mercato e sentiment analysis</p>
                    </div>
                    <div class="flex gap-2">
                        ${Components.createButton({ 
                            text: '🔄 Refresh', 
                            variant: 'outline',
                            onclick: 'refreshNews()'
                        })}
                    </div>
                </div>

                <!-- Market Sentiment -->
                <div class="grid gap-6 md:grid-cols-3">
                    ${Components.createStatCard({
                        title: 'Market Sentiment',
                        value: '📈 Bullish',
                        description: 'Sentiment generale del mercato',
                        icon: 'trending-up',
                        color: 'text-green-600'
                    })}
                    ${Components.createStatCard({
                        title: 'Fear & Greed Index',
                        value: '67',
                        description: 'Indice di paura e avidità',
                        icon: 'activity',
                        color: 'text-yellow-600'
                    })}
                    ${Components.createStatCard({
                        title: 'Volatility Index',
                        value: '18.5',
                        description: 'VIX - Indice di volatilità',
                        icon: 'bar-chart',
                        color: 'text-blue-600'
                    })}
                </div>

                <!-- News Feed -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">🗞️ Latest News</h3>
                    </div>
                    <div class="divide-y divide-gray-200" id="newsFeed">
                        ${this.renderMockNews()}
                    </div>
                </div>
            </div>
        `;
    }

    static renderMockNews() {
        const mockNews = [
            {
                title: "Federal Reserve Hints at Interest Rate Changes",
                summary: "The Federal Reserve suggests potential policy shifts in upcoming meeting, impacting USD pairs significantly.",
                time: "2 hours ago",
                sentiment: "bearish",
                impact: "high"
            },
            {
                title: "Bitcoin Breaks Key Resistance Level",
                summary: "BTC surges past $46,000 resistance with strong volume, institutional buying continues.",
                time: "4 hours ago",
                sentiment: "bullish",
                impact: "medium"
            },
            {
                title: "Gold Reaches New Monthly High",
                summary: "Safe haven demand drives gold prices as geopolitical tensions persist in key regions.",
                time: "6 hours ago",
                sentiment: "bullish",
                impact: "medium"
            },
            {
                title: "ECB Policy Decision Expected",
                summary: "European Central Bank meeting scheduled for Thursday, EUR volatility anticipated.",
                time: "8 hours ago",
                sentiment: "neutral",
                impact: "high"
            }
        ];

        return mockNews.map(news => `
            <div class="p-6 hover:bg-gray-50">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 mb-2">${news.title}</h4>
                        <p class="text-gray-600 text-sm mb-3">${news.summary}</p>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                            <span class="flex items-center gap-1">
                                <i data-lucide="clock" class="w-3 h-3"></i>
                                ${news.time}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="${news.sentiment === 'bullish' ? 'trending-up' : news.sentiment === 'bearish' ? 'trending-down' : 'minus'}" 
                                   class="w-3 h-3 ${news.sentiment === 'bullish' ? 'text-green-500' : news.sentiment === 'bearish' ? 'text-red-500' : 'text-gray-500'}"></i>
                                ${news.sentiment}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="activity" class="w-3 h-3"></i>
                                ${news.impact} impact
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // History Page
    static renderHistoryPage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 class="text-3xl font-bold">📚 Trading History</h1>
                        <p class="text-gray-600">Storico completo delle operazioni e performance</p>
                    </div>
                    <div class="flex gap-2">
                        ${Components.createButton({ 
                            text: '📊 Export CSV', 
                            variant: 'outline',
                            onclick: 'exportHistory()'
                        })}
                        ${Components.createButton({ 
                            text: '🔄 Refresh', 
                            variant: 'outline',
                            onclick: 'refreshHistory()'
                        })}
                    </div>
                </div>

                <!-- Performance Summary -->
                <div id="historySummary" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    ${Array.from({ length: 4 }, () => Components.createLoadingSkeleton('card')).join('')}
                </div>

                <!-- Filters -->
                <div class="bg-white rounded-lg shadow-md border p-6">
                    <h3 class="text-lg font-semibold mb-4">🔍 Filtri</h3>
                    <div class="grid gap-4 md:grid-cols-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Periodo</label>
                            <select class="w-full p-2 border border-gray-300 rounded">
                                <option>Ultimo mese</option>
                                <option>Ultimi 3 mesi</option>
                                <option>Ultimo anno</option>
                                <option>Tutto</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Asset</label>
                            <select class="w-full p-2 border border-gray-300 rounded">
                                <option>Tutti</option>
                                <option>BTCUSD</option>
                                <option>EURUSD</option>
                                <option>XAUUSD</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                            <select class="w-full p-2 border border-gray-300 rounded">
                                <option>Tutti</option>
                                <option>Chiusi</option>
                                <option>In profitto</option>
                                <option>In perdita</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            ${Components.createButton({ 
                                text: 'Applica Filtri', 
                                variant: 'primary',
                                onclick: 'applyHistoryFilters()'
                            })}
                        </div>
                    </div>
                </div>

                <!-- History Table -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">📈 Storico Operazioni</h3>
                    </div>
                    <div class="overflow-x-auto">
                        <div id="fullHistoryTable">
                            <div class="text-center py-8">
                                <div class="loading-spinner mx-auto mb-2"></div>
                                <p class="text-gray-500">Caricamento storico...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Settings Page
    static renderSettingsPage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div>
                    <h1 class="text-3xl font-bold">⚙️ Impostazioni</h1>
                    <p class="text-gray-600">Configura la piattaforma secondo le tue preferenze</p>
                </div>

                <div class="grid gap-6 lg:grid-cols-3">
                    <!-- User Profile -->
                    <div class="bg-white rounded-lg shadow-md border p-6">
                        <h3 class="text-lg font-semibold mb-4">👤 Profilo Utente</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                <input type="text" value="Demo User" class="w-full p-2 border border-gray-300 rounded">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value="demo@tradingai.com" class="w-full p-2 border border-gray-300 rounded">
                            </div>
                            ${Components.createButton({ text: 'Salva Profilo', variant: 'primary' })}
                        </div>
                    </div>

                    <!-- Trading Settings -->
                    <div class="bg-white rounded-lg shadow-md border p-6">
                        <h3 class="text-lg font-semibold mb-4">📊 Impostazioni Trading</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Rischio per Trade (%)</label>
                                <input type="number" value="2" min="0.1" max="10" step="0.1" class="w-full p-2 border border-gray-300 rounded">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Saldo Account</label>
                                <input type="number" value="10000" class="w-full p-2 border border-gray-300 rounded">
                            </div>
                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="mr-2">
                                    <span class="text-sm">Auto-execute signals</span>
                                </label>
                            </div>
                            ${Components.createButton({ text: 'Salva Trading', variant: 'primary' })}
                        </div>
                    </div>

                    <!-- Notifications -->
                    <div class="bg-white rounded-lg shadow-md border p-6">
                        <h3 class="text-lg font-semibold mb-4">🔔 Notifiche</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="mr-2">
                                    <span class="text-sm">Nuovi segnali</span>
                                </label>
                            </div>
                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" checked class="mr-2">
                                    <span class="text-sm">Trade completati</span>
                                </label>
                            </div>
                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" class="mr-2">
                                    <span class="text-sm">Aggiornamenti AI</span>
                                </label>
                            </div>
                            ${Components.createButton({ text: 'Salva Notifiche', variant: 'primary' })}
                        </div>
                    </div>
                </div>

                <!-- MT5 Connection Status -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">🔗 Connessione MT5</h3>
                    </div>
                    <div class="p-6">
                        <div id="mt5ConnectionStatus">
                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div class="flex items-center gap-3">
                                    <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                                    <div>
                                        <div class="font-medium">Verifica Connessione...</div>
                                        <div class="text-sm text-gray-600">Controllo stato MT5</div>
                                    </div>
                                </div>
                                ${Components.createButton({ 
                                    text: 'Configura MT5', 
                                    variant: 'outline',
                                    onclick: 'Router.navigate("mt5-setup")'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // MT5 Setup Page
    static renderMT5Setup() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div>
                    <h1 class="text-3xl font-bold">🔧 MetaTrader 5 Setup</h1>
                    <p class="text-gray-600">Configura la connessione con MetaTrader 5 per il trading automatico</p>
                </div>

                <!-- Setup Steps -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">🚀 Guida Setup MT5</h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-6">
                            <!-- Step 1 -->
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                                <div class="flex-1">
                                    <h4 class="font-semibold mb-2">Download MetaTrader 5</h4>
                                    <p class="text-gray-600 mb-3">Scarica e installa MetaTrader 5 dal sito ufficiale del tuo broker.</p>
                                    ${Components.createButton({ 
                                        text: '📥 Download MT5', 
                                        variant: 'outline',
                                        onclick: 'window.open("https://www.metatrader5.com/", "_blank")'
                                    })}
                                </div>
                            </div>

                            <!-- Step 2 -->
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                                <div class="flex-1">
                                    <h4 class="font-semibold mb-2">Configura Account</h4>
                                    <p class="text-gray-600 mb-3">Inserisci i dettagli del tuo account MT5 qui sotto.</p>
                                    
                                    <form id="mt5ConfigForm" class="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Login</label>
                                            <input type="text" id="mt5Login" placeholder="Account number" class="w-full p-2 border border-gray-300 rounded">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                            <input type="password" id="mt5Password" placeholder="Password" class="w-full p-2 border border-gray-300 rounded">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Server</label>
                                            <input type="text" id="mt5Server" placeholder="Server name" class="w-full p-2 border border-gray-300 rounded">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Broker</label>
                                            <input type="text" id="mt5Broker" placeholder="Broker name" class="w-full p-2 border border-gray-300 rounded">
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <!-- Step 3 -->
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                                <div class="flex-1">
                                    <h4 class="font-semibold mb-2">Test Connessione</h4>
                                    <p class="text-gray-600 mb-3">Testa la connessione per assicurarti che tutto funzioni.</p>
                                    <div class="flex gap-2">
                                        ${Components.createButton({ 
                                            text: '💾 Salva Config', 
                                            variant: 'primary',
                                            onclick: 'saveMT5Config()'
                                        })}
                                        ${Components.createButton({ 
                                            text: '🧪 Test Connessione', 
                                            variant: 'outline',
                                            onclick: 'testMT5Connection()'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Connection Status -->
                <div id="mt5Status" class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">📡 Stato Connessione</h3>
                    </div>
                    <div class="p-6">
                        <div class="text-center py-8">
                            <i data-lucide="wifi-off" class="h-16 w-16 mx-auto mb-4 text-gray-400"></i>
                            <h4 class="font-semibold text-gray-800 mb-2">Non Connesso</h4>
                            <p class="text-gray-600">Compila i dati sopra e testa la connessione</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Guides Page
    static renderGuidesPage() {
        return `
            <div class="space-y-6">
                <!-- Header -->
                <div>
                    <h1 class="text-3xl font-bold">📚 Trading Guides</h1>
                    <p class="text-gray-600">Guide complete per massimizzare i risultati con AI Trading Boost</p>
                </div>

                <!-- Guide Categories -->
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    ${this.renderGuideCategories()}
                </div>

                <!-- Popular Guides -->
                <div class="bg-white rounded-lg shadow-md border">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">⭐ Guide Popolari</h3>
                    </div>
                    <div class="divide-y divide-gray-200">
                        ${this.renderPopularGuides()}
                    </div>
                </div>
            </div>
        `;
    }

    static renderGuideCategories() {
        const categories = [
            {
                title: '🚀 Getting Started',
                description: 'Prime configurazioni e setup',
                count: 8,
                color: 'bg-blue-500'
            },
            {
                title: '🤖 AI & Machine Learning',
                description: 'Come funziona l\'intelligenza artificiale',
                count: 12,
                color: 'bg-purple-500'
            },
            {
                title: '📊 Trading Strategies',
                description: 'Strategie e tecniche avanzate',
                count: 15,
                color: 'bg-green-500'
            },
            {
                title: '⚙️ Technical Setup',
                description: 'Configurazioni tecniche e MT5',
                count: 6,
                color: 'bg-orange-500'
            },
            {
                title: '📈 Risk Management',
                description: 'Gestione del rischio e money management',
                count: 10,
                color: 'bg-red-500'
            },
            {
                title: '🔧 Troubleshooting',
                description: 'Risoluzione problemi comuni',
                count: 7,
                color: 'bg-gray-500'
            }
        ];

        return categories.map(cat => `
            <div class="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 ${cat.color} rounded-lg flex items-center justify-center text-white font-bold">
                        ${cat.count}
                    </div>
                    <div>
                        <h3 class="font-semibold">${cat.title}</h3>
                        <p class="text-sm text-gray-600">${cat.description}</p>
                    </div>
                </div>
                ${Components.createButton({ text: 'Esplora', variant: 'outline', size: 'small' })}
            </div>
        `).join('');
    }

    static renderPopularGuides() {
        const guides = [
            {
                title: "Come iniziare con AI Trading Boost",
                description: "Guida completa per i nuovi utenti dalla registrazione al primo trade.",
                readTime: "10 min",
                difficulty: "Principiante"
            },
            {
                title: "Configurazione ottimale di MetaTrader 5",
                description: "Setup passo-passo di MT5 per il trading automatico.",
                readTime: "15 min",
                difficulty: "Intermedio"
            },
            {
                title: "Capire i segnali dell'intelligenza artificiale",
                description: "Come interpretare e sfruttare al meglio i segnali AI.",
                readTime: "12 min",
                difficulty: "Intermedio"
            },
            {
                title: "Risk Management avanzato",
                description: "Tecniche professionali per gestire il rischio.",
                readTime: "20 min",
                difficulty: "Avanzato"
            }
        ];

        return guides.map(guide => `
            <div class="p-6 hover:bg-gray-50 cursor-pointer">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 mb-2">${guide.title}</h4>
                        <p class="text-gray-600 text-sm mb-3">${guide.description}</p>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                            <span class="flex items-center gap-1">
                                <i data-lucide="clock" class="w-3 h-3"></i>
                                ${guide.readTime}
                            </span>
                            <span class="flex items-center gap-1">
                                <i data-lucide="user" class="w-3 h-3"></i>
                                ${guide.difficulty}
                            </span>
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </div>
            </div>
        `).join('');
    }
}

// Global functions for page interactions
window.generateCustomSignal = async () => {
    const symbol = document.getElementById('symbolSelect').value;
    const strategy = document.getElementById('strategySelect').value;
    
    const container = document.getElementById('generatedSignal');
    container.innerHTML = `
        <div class="text-center py-8">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">Generazione segnale per ${symbol}...</p>
        </div>
    `;

    try {
        const signal = await window.API.generateSignal({ 
            symbol, 
            strategy: strategy === 'auto' ? undefined : strategy 
        });
        
        container.innerHTML = Components.createSignalCard(signal);
        Components.initializeIcons();
        Utils.showNotification(`Segnale ${signal.direction} generato per ${symbol}`, 'success');
    } catch (error) {
        container.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="alert-circle" class="h-16 w-16 mx-auto mb-4 text-red-400"></i>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Errore Generazione</h3>
                <p class="text-gray-600">${error.message}</p>
                ${Components.createButton({ text: 'Riprova', variant: 'outline', onclick: 'generateCustomSignal()' })}
            </div>
        `;
        Components.initializeIcons();
    }
};

window.selectAsset = (asset) => {
    document.getElementById('symbolSelect').value = asset;
};

window.saveMT5Config = () => {
    const config = {
        login: document.getElementById('mt5Login').value,
        password: document.getElementById('mt5Password').value,
        server: document.getElementById('mt5Server').value,
        broker: document.getElementById('mt5Broker').value
    };

    if (!config.login || !config.password || !config.server) {
        Utils.showNotification('Compila tutti i campi obbligatori', 'error');
        return;
    }

    localStorage.setItem('mt5_config', JSON.stringify(config));
    Utils.showNotification('Configurazione MT5 salvata', 'success');
};

window.testMT5Connection = async () => {
    const statusContainer = document.getElementById('mt5Status');
    statusContainer.innerHTML = `
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold">📡 Stato Connessione</h3>
        </div>
        <div class="p-6">
            <div class="text-center py-8">
                <div class="loading-spinner mx-auto mb-4"></div>
                <p class="text-gray-600">Test connessione in corso...</p>
            </div>
        </div>
    `;

    try {
        const status = await window.API.getMt5Status();
        
        if (status.connected) {
            statusContainer.innerHTML = `
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold">📡 Stato Connessione</h3>
                </div>
                <div class="p-6">
                    <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div class="flex items-center gap-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <div class="font-medium text-green-800">Connesso con successo</div>
                                <div class="text-sm text-green-600">
                                    ${status.accountInfo?.name || 'Demo Account'} | 
                                    Balance: $${status.accountInfo?.balance?.toFixed(2) || '0.00'}
                                </div>
                            </div>
                        </div>
                        <i data-lucide="check-circle" class="w-6 h-6 text-green-500"></i>
                    </div>
                </div>
            `;
            Utils.showNotification('MT5 connesso con successo!', 'success');
        } else {
            throw new Error('Connessione MT5 fallita');
        }
    } catch (error) {
        statusContainer.innerHTML = `
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold">📡 Stato Connessione</h3>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                            <div class="font-medium text-red-800">Connessione fallita</div>
                            <div class="text-sm text-red-600">${error.message}</div>
                        </div>
                    </div>
                    <i data-lucide="alert-circle" class="w-6 h-6 text-red-500"></i>
                </div>
            </div>
        `;
        Utils.showNotification('Errore connessione MT5', 'error');
    }
    
    Components.initializeIcons();
};

console.log('📄 Additional pages loaded');