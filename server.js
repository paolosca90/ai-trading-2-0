const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://jeewrxgqkgvtrphebcxz.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplZXdyeGdxa2d2dHJwaGViY3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzAzNDksImV4cCI6MjA3MjIwNjM0OX0.W1ufn1l_zArMyAaameVwo2a4Z7cmSoGV27zvki57tMI';

const supabase = createClient(supabaseUrl, supabaseKey);

// CORS configuration for all origins
app.use(cors({
  origin: true, // Allow all origins for flexibility
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('.'));

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User authentication
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Hash password (in produzione usa bcrypt)
    const hashedPassword = password; // Semplificato per demo

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user in Supabase
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ New user registered: ${email}`);
    res.json({
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email, name: newUser.name }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in Supabase (simplified - no password check for demo)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session in Supabase
    const token = `session_${Date.now()}_${user.id}`;
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert([
        {
          user_id: user.id,
          session_token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);

    if (sessionError) {
      console.error('Session creation error:', sessionError);
    }

    console.log(`✅ User logged in: ${email}`);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Find session in Supabase
    const { data: session, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, users:id,email,name,created_at')
      .eq('session_token', token)
      .eq('expires_at', '>', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    res.json({
      user: {
        id: session.user_id,
        name: session.users.name,
        email: session.users.email,
        createdAt: session.users.created_at
      }
    });
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Trading signals API
app.get('/analysis/top-signals', async (req, res) => {
  try {
    // Generate mock trading signals
    const signals = [
      {
        symbol: 'EURUSD',
        direction: 'LONG',
        probability: 0.78,
        riskFactor: 1.2,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'BTCUSD',
        direction: 'SHORT',
        probability: 0.82,
        riskFactor: 1.5,
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'NAS100',
        direction: 'LONG',
        probability: 0.75,
        riskFactor: 1.8,
        timestamp: new Date().toISOString()
      }
    ];

    res.json({ signals });
  } catch (error) {
    console.error('❌ Signals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/analysis/predict', async (req, res) => {
  try {
    const { symbol, strategy } = req.body;

    // Mock prediction based on symbol and strategy
    const directions = ['LONG', 'SHORT'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const probability = 0.7 + Math.random() * 0.25; // 70-95% probability

    const signal = {
      symbol,
      strategy,
      direction,
      probability: Math.round(probability * 100) / 100,
      risk_factor: 1.0 + Math.random() * 2.5, // 1.0-3.5 risk factor
      confidence: Math.floor(Math.random() * 5) + 1, // 1-5 stars
      created_at: new Date().toISOString(),
      status: 'active'
    };

    // Save to Supabase
    const { data: savedSignal, error } = await supabase
      .from('trading_signals')
      .insert([signal])
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Generated signal: ${savedSignal.symbol} ${savedSignal.direction} (${Math.round(savedSignal.probability * 100)}%)`);
    res.json({
      message: 'Signal generated',
      signal: savedSignal
    });
  } catch (error) {
    console.error('❌ Prediction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Performance API
app.get('/analysis/performance', async (req, res) => {
  try {
    // Mock performance data
    const performance = {
      totalProfit: '+$1,247.83',
      winRate: '78%',
      totalTrades: 47,
      winTrades: 37,
      lossTrades: 10,
      avgWin: '$45.23',
      avgLoss: '$18.76',
      largestWin: '$234.56',
      largestLoss: '$67.89',
      profitFactor: '2.3',
      maxDrawdown: '8.2%',
      recoveryTime: '3 days',
      sharpeRatio: '2.4'
    };

    res.json({ performance });
  } catch (error) {
    console.error('❌ Performance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// MT5 Status (simulated)
app.get('/mt5/status', async (req, res) => {
  try {
    // Simulate MT5 connection status
    const mt5Status = {
      connected: Math.random() > 0.2, // 80% chance of being connected
      server: 'RoboForex-ECN',
      account: '67163307',
      balance: Math.floor(2000 + Math.random() * 8000), // $2000-10000
      timestamp: new Date().toISOString(),
      version: '1.9.24'
    };

    res.json(mt5Status);
  } catch (error) {
    console.error('❌ MT5 status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/mt5/positions', async (req, res) => {
  try {
    // Mock positions
    const positions = [
      {
        ticket: 12345,
        symbol: 'EURUSD',
        type: 'BUY',
        lots: 0.05,
        openPrice: 1.0845,
        currentPrice: 1.0892,
        profit: '+$47.25',
        swap: '+$0.12',
        commission: '-$1.50',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({ positions });
  } catch (error) {
    console.error('❌ MT5 positions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ML Analytics
app.get('/ml/analytics', async (req, res) => {
  try {
    const analytics = {
      accuracy: 0.98,
      precision: 0.92,
      recall: 0.88,
      f1Score: 0.90,
      totalPredictions: 1534,
      correctPredictions: 1500,
      models: {
        neuralNetwork: { accuracy: 0.96, status: 'active' },
        decisionTree: { accuracy: 0.89, status: 'backup' },
        randomForest: { accuracy: 0.94, status: 'training' }
      },
      lastTraining: new Date().toISOString(),
      nextTraining: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    res.json({ analytics });
  } catch (error) {
    console.error('❌ ML analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/mt5/')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 AI Trading 2.0 JavaScript Server');
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log(`🔌 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ Ready for Render deployment!');
});

module.exports = app;