#!/bin/bash

# 🚀 AI Trading 2.0 - Render.com Build Script
# This script prepares the static HTML+JavaScript application for deployment

echo "🚀 Building AI Trading 2.0 for Render.com deployment..."
echo "================================================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the ai-trading-2.0 directory."
    exit 1
fi

# Create build info
echo "📝 Creating build information..."
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat > build-info.json << EOF
{
  "name": "AI Trading 2.0",
  "version": "2.0.0",
  "buildDate": "$BUILD_DATE",
  "platform": "render",
  "type": "static",
  "backend": "https://backend-kzbh2zv05-paolos-projects-dc6990da.vercel.app",
  "mt5Server": "154.61.187.189:8080"
}
EOF

# Validate critical files exist
echo "✅ Validating critical files..."
REQUIRED_FILES=(
    "index.html"
    "pages/dashboard.html"
    "pages/trade.html"
    "pages/mldashboard.html"
    "pages/login.html"
    "pages/register.html"
    "pages/settings.html"
    "js/config.js"
    "js/api.js"
    "js/app.js"
    "css/style.css"
    "_redirects"
    "render.yaml"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ Missing: $file"
        exit 1
    fi
done

# Verify configuration
echo "🔧 Verifying configuration..."
if grep -q "backend-kzbh2zv05-paolos-projects-dc6990da.vercel.app" js/config.js; then
    echo "  ✓ Backend API URL configured"
else
    echo "  ❌ Backend API URL not properly configured"
    exit 1
fi

if grep -q "154.61.187.189" js/config.js; then
    echo "  ✓ MT5 server configured"
else
    echo "  ❌ MT5 server not properly configured"
    exit 1
fi

# Check for production settings
echo "🏭 Checking production settings..."
if grep -q "ENV: 'production'" js/config.js; then
    echo "  ✓ Production environment set"
else
    echo "  ⚠️  Warning: Environment not set to production"
fi

# Generate deployment manifest
echo "📋 Generating deployment manifest..."
cat > deployment-manifest.json << EOF
{
  "deployment": {
    "platform": "render",
    "type": "static",
    "buildCommand": "echo 'Building AI Trading 2.0 static site...'",
    "publishPath": "./",
    "routes": {
      "spa": true,
      "fallback": "/index.html"
    }
  },
  "pages": [
    {"path": "/", "file": "index.html", "title": "AI Trading 2.0 - Home"},
    {"path": "/dashboard", "file": "pages/dashboard.html", "title": "Dashboard"},
    {"path": "/trade", "file": "pages/trade.html", "title": "Trade"},
    {"path": "/mldashboard", "file": "pages/mldashboard.html", "title": "ML Dashboard"},
    {"path": "/login", "file": "pages/login.html", "title": "Login"},
    {"path": "/register", "file": "pages/register.html", "title": "Register"},
    {"path": "/settings", "file": "pages/settings.html", "title": "Settings"}
  ],
  "apis": {
    "backend": "https://backend-kzbh2zv05-paolos-projects-dc6990da.vercel.app",
    "mt5": "http://154.61.187.189:8080",
    "database": "https://jeewrxgqkgvtrphebcxz.supabase.co"
  },
  "features": [
    "Real-time trading signals",
    "MT5 integration",
    "Machine learning analytics",
    "Automated trading execution",
    "Performance tracking",
    "Multi-asset support"
  ]
}
EOF

# Create README for deployment
echo "📚 Creating deployment README..."
cat > DEPLOYMENT_README.md << 'EOF'
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
EOF

echo "================================================="
echo "✅ Build completed successfully!"
echo ""
echo "📊 Build Summary:"
echo "  • Platform: Render.com (Static Site)"
echo "  • Type: HTML+JavaScript SPA"
echo "  • Backend: Vercel (existing)"
echo "  • MT5 Server: VPS (154.61.187.189:8080)"
echo "  • Database: Supabase"
echo ""
echo "🎯 Next Steps:"
echo "  1. Commit changes to git repository"
echo "  2. Connect repository to Render.com"
echo "  3. Deploy using render.yaml configuration"
echo ""
echo "🔗 Ready for deployment to Render.com!"