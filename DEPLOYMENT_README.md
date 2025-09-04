# AI Trading 2.0 - Render.com Deployment

## 🚀 Deployment Status
This is a complete HTML+JavaScript trading application deployed on Render.com.

## 📁 Project Structure
```
ai-trading-2.0/
├── index.html              # Landing page
├── pages/                  # Application pages
│   ├── dashboard.html      # Main trading dashboard
│   ├── trade.html          # Trading interface
│   ├── mldashboard.html    # ML analytics
│   ├── login.html          # User login
│   ├── register.html       # User registration
│   └── settings.html       # User settings
├── js/                     # JavaScript modules
│   ├── config.js           # Configuration & API
│   ├── app.js              # Main application
│   └── ...                 # Other modules
├── css/                    # Stylesheets
├── assets/                 # Static assets
├── _redirects              # Render routing rules
└── render.yaml             # Render configuration
```

## 🔗 API Integration
- **Backend API**: https://backend-kzbh2zv05-paolos-projects-dc6990da.vercel.app
- **MT5 Server**: 154.61.187.189:8080
- **Database**: Supabase (configured in config.js)

## ✨ Features
- ⚡ Real-time trading signals
- 📊 Advanced technical analysis
- 🤖 AI-powered predictions
- 📈 Performance tracking
- 💱 Multi-asset support (Forex, Crypto, Indices, Commodities)
- 🔒 Secure authentication
- 📱 Responsive design

## 🛠 Local Development
```bash
# Start local server
npm run dev

# Build for production
npm run build
```

## 🚀 Deployment
This application is configured for automatic deployment on Render.com using the `render.yaml` configuration file.
