-- 🚀 AI Trading 2.0 - Supabase Database Schema
-- Run this script in SQL Editor in your Supabase dashboard

-- ============================================================
-- TABLE: users - User accounts and basic information
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords in production!
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: user_sessions - Authentication sessions
-- ============================================================

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

-- ============================================================
-- TABLE: trading_signals - AI generated trading signals
-- ============================================================

CREATE TABLE trading_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    strategy VARCHAR(100) NOT NULL,
    direction VARCHAR(10) NOT NULL, -- 'LONG' or 'SHORT'
    probability DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
    risk_factor DECIMAL(5,2),
    confidence INTEGER, -- 1 to 5 stars
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' -- active, closed, expired
);

-- ============================================================
-- TABLE: trading_performance - Trading performance metrics
-- ============================================================

CREATE TABLE trading_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    total_profit DECIMAL(10,2),
    win_rate DECIMAL(5,2), -- Percentage
    total_trades INTEGER,
    win_trades INTEGER,
    loss_trades INTEGER,
    avg_win DECIMAL(8,2),
    avg_loss DECIMAL(8,2),
    largest_win DECIMAL(8,2),
    largest_loss DECIMAL(8,2),
    profit_factor DECIMAL(5,2),
    max_drawdown DECIMAL(5,2),
    sharpe_ratio DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: ml_analytics - Machine Learning performance metrics
-- ============================================================

CREATE TABLE ml_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100),
    accuracy DECIMAL(5,4), -- 0.0000 to 1.0000
    precision DECIMAL(5,4),
    recall DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    total_predictions INTEGER,
    correct_predictions INTEGER,
    last_training TIMESTAMP,
    next_training TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: mt5_status - MT5 Terminal connection status
-- ============================================================

CREATE TABLE mt5_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connected BOOLEAN DEFAULT FALSE,
    server VARCHAR(100),
    account VARCHAR(20),
    balance DECIMAL(10,2),
    timestamp TIMESTAMP DEFAULT NOW(),
    version VARCHAR(20),
    last_connection_attempt TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: mt5_positions - MT5 open positions
-- ============================================================

CREATE TABLE mt5_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket BIGINT UNIQUE NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'BUY' or 'SELL'
    lots DECIMAL(5,2),
    open_price DECIMAL(10,5),
    current_price DECIMAL(10,5),
    profit DECIMAL(8,2),
    swap DECIMAL(6,2),
    commission DECIMAL(6,2),
    open_time TIMESTAMP DEFAULT NOW(),
    close_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- active, closed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES for better performance
-- ============================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Sessions table indexes
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);

-- Trading signals indexes
CREATE INDEX idx_signals_symbol ON trading_signals(symbol);
CREATE INDEX idx_signals_status ON trading_signals(status);
CREATE INDEX idx_signals_created_at ON trading_signals(created_at);
CREATE INDEX idx_signals_probability ON trading_signals(probability);

-- MT5 positions indexes
CREATE INDEX idx_mt5_positions_ticket ON mt5_positions(ticket);
CREATE INDEX idx_mt5_positions_symbol ON mt5_positions(symbol);
CREATE INDEX idx_mt5_positions_status ON mt5_positions(status);
CREATE INDEX idx_mt5_positions_open_time ON mt5_positions(open_time);

-- ============================================================
-- ROW LEVEL SECURITY (Recommended for production)
-- ============================================================

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt5_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE mt5_positions ENABLE ROW LEVEL SECURITY;

-- Create policies (customize these based on your auth system)
-- Example: Users can only see their own data
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id::text);

-- View created tables
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'trading_signals', COUNT(*) FROM trading_signals
UNION ALL
SELECT 'mt5_status', COUNT(*) FROM mt5_status;