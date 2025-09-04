// Charts and Visualization Components
class Charts {
    
    // Create performance chart
    static createPerformanceChart(containerId, data) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        const dates = data.map(d => d.date);
        const accuracy = data.map(d => parseFloat(d.accuracy));
        const profitLoss = data.map(d => parseFloat(d.profitLoss));

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Accuracy (%)',
                        data: accuracy,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Profit/Loss ($)',
                        data: profitLoss,
                        borderColor: 'rgb(16, 185, 129)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'ML Performance Timeline'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        },
                        min: 0,
                        max: 100
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Profit/Loss ($)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Create feature importance chart
    static createFeatureChart(containerId, data) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        const features = data.map(d => d.feature);
        const importance = data.map(d => parseFloat(d.importance));

        // Color mapping for different feature types
        const colorMap = {
            'technical': 'rgba(59, 130, 246, 0.8)',
            'fundamental': 'rgba(16, 185, 129, 0.8)',
            'microstructure': 'rgba(139, 92, 246, 0.8)',
            'risk': 'rgba(245, 158, 11, 0.8)',
            'default': 'rgba(107, 114, 128, 0.8)'
        };

        const backgroundColors = data.map(d => colorMap[d.type] || colorMap.default);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: features,
                datasets: [{
                    label: 'Importance (%)',
                    data: importance,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Feature Importance'
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const dataPoint = data[context.dataIndex];
                                return `Type: ${dataPoint.type}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Importance (%)'
                        },
                        max: 100
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Features'
                        }
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 2,
                    }
                }
            }
        });
    }

    // Create profit/loss distribution chart
    static createProfitDistributionChart(containerId, data) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        // Categorize trades by profit/loss ranges
        const ranges = [
            { label: '< -$100', min: -Infinity, max: -100, color: 'rgba(239, 68, 68, 0.8)' },
            { label: '-$100 to -$50', min: -100, max: -50, color: 'rgba(248, 113, 113, 0.8)' },
            { label: '-$50 to $0', min: -50, max: 0, color: 'rgba(252, 165, 165, 0.8)' },
            { label: '$0 to $50', min: 0, max: 50, color: 'rgba(187, 247, 208, 0.8)' },
            { label: '$50 to $100', min: 50, max: 100, color: 'rgba(34, 197, 94, 0.8)' },
            { label: '> $100', min: 100, max: Infinity, color: 'rgba(22, 163, 74, 0.8)' }
        ];

        const distribution = ranges.map(range => {
            const count = data.filter(trade => trade.profit > range.min && trade.profit <= range.max).length;
            return { ...range, count };
        });

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: distribution.map(d => d.label),
                datasets: [{
                    data: distribution.map(d => d.count),
                    backgroundColor: distribution.map(d => d.color),
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    title: {
                        display: true,
                        text: 'Profit/Loss Distribution'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label;
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} trades (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '50%'
            }
        });
    }

    // Create monthly performance chart
    static createMonthlyPerformanceChart(containerId, data) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        // Group data by month
        const monthlyData = this.groupDataByMonth(data);
        const months = Object.keys(monthlyData).sort();
        const monthlyProfits = months.map(month => {
            const monthData = monthlyData[month];
            return monthData.reduce((sum, trade) => sum + trade.profit, 0);
        });

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months.map(month => {
                    const date = new Date(month);
                    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }),
                datasets: [{
                    label: 'Monthly Profit ($)',
                    data: monthlyProfits,
                    backgroundColor: monthlyProfits.map(profit => 
                        profit >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                    ),
                    borderColor: monthlyProfits.map(profit => 
                        profit >= 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
                    ),
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Monthly Performance'
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: function(context) {
                                const month = months[context.dataIndex];
                                const monthData = monthlyData[month];
                                const trades = monthData.length;
                                const winRate = (monthData.filter(t => t.profit > 0).length / trades * 100).toFixed(1);
                                return [`Trades: ${trades}`, `Win Rate: ${winRate}%`];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Profit ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    }
                }
            }
        });
    }

    // Create asset performance comparison chart
    static createAssetComparisonChart(containerId, data) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        // Group by asset
        const assetData = {};
        data.forEach(trade => {
            if (!assetData[trade.symbol]) {
                assetData[trade.symbol] = [];
            }
            assetData[trade.symbol].push(trade);
        });

        const assets = Object.keys(assetData);
        const assetMetrics = assets.map(asset => {
            const trades = assetData[asset];
            const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
            const winRate = (trades.filter(t => t.profit > 0).length / trades.length) * 100;
            return { asset, totalProfit, winRate, trades: trades.length };
        });

        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Assets Performance',
                    data: assetMetrics.map(metric => ({
                        x: metric.winRate,
                        y: metric.totalProfit,
                        asset: metric.asset,
                        trades: metric.trades
                    })),
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    pointRadius: assetMetrics.map(metric => Math.max(5, Math.min(15, metric.trades / 2)))
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Asset Performance Comparison'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].raw.asset;
                            },
                            label: function(context) {
                                const data = context.raw;
                                return [
                                    `Win Rate: ${data.x.toFixed(1)}%`,
                                    `Total Profit: $${data.y.toFixed(2)}`,
                                    `Trades: ${data.trades}`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Win Rate (%)'
                        },
                        min: 0,
                        max: 100
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total Profit ($)'
                        }
                    }
                }
            }
        });
    }

    // Create real-time signal strength gauge
    static createSignalStrengthGauge(containerId, strength) {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        const gaugeData = [
            { label: 'Weak', value: 25, color: 'rgba(239, 68, 68, 0.8)' },
            { label: 'Moderate', value: 25, color: 'rgba(245, 158, 11, 0.8)' },
            { label: 'Strong', value: 25, color: 'rgba(34, 197, 94, 0.8)' },
            { label: 'Very Strong', value: 25, color: 'rgba(22, 163, 74, 0.8)' }
        ];

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: gaugeData.map(d => d.label),
                datasets: [{
                    data: gaugeData.map(d => d.value),
                    backgroundColor: gaugeData.map(d => d.color),
                    borderWidth: 0,
                    circumference: 180,
                    rotation: 270
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                cutout: '80%'
            },
            plugins: [{
                id: 'gaugeNeedle',
                afterDatasetDraw(chart) {
                    const { ctx, width, height } = chart;
                    const centerX = width / 2;
                    const centerY = height / 2;
                    
                    // Calculate needle position based on strength (0-100)
                    const angle = (strength / 100) * Math.PI - Math.PI / 2;
                    const needleLength = height / 3;
                    
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(angle);
                    
                    // Draw needle
                    ctx.beginPath();
                    ctx.moveTo(0, -2);
                    ctx.lineTo(needleLength, 0);
                    ctx.lineTo(0, 2);
                    ctx.fillStyle = '#374151';
                    ctx.fill();
                    
                    // Draw center circle
                    ctx.beginPath();
                    ctx.arc(0, 0, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = '#374151';
                    ctx.fill();
                    
                    ctx.restore();
                    
                    // Draw strength text
                    ctx.font = 'bold 16px Inter';
                    ctx.fillStyle = '#374151';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${strength}%`, centerX, centerY + 40);
                }
            }]
        });
    }

    // Helper function to group data by month
    static groupDataByMonth(data) {
        const grouped = {};
        data.forEach(item => {
            const date = new Date(item.openTime || item.timestamp);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(item);
        });
        return grouped;
    }

    // Create mini sparkline chart
    static createSparkline(containerId, data, color = '#3B82F6') {
        const ctx = document.getElementById(containerId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, index) => index),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: {
                    point: { radius: 0 }
                }
            }
        });
    }

    // Destroy chart instance
    static destroyChart(chart) {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    }
}

// Global Charts instance
window.Charts = Charts;

console.log('📊 Charts library loaded');