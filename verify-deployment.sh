#!/bin/bash

# 🚀 AI Trading 2.0 - Deployment Verification Script
# This script verifies that all components are ready for Render.com deployment

echo "🔍 AI Trading 2.0 - Deployment Verification"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Error: index.html not found. Run this script from ai-trading-2.0 directory.${NC}"
    exit 1
fi

echo "📁 Verifying file structure..."

# Critical files check
CRITICAL_FILES=(
    "index.html"
    "render.yaml"
    "_redirects"
    "package.json"
    "build.sh"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}❌${NC} Missing: $file"
        exit 1
    fi
done

# HTML pages check
HTML_PAGES=(
    "pages/dashboard.html"
    "pages/trade.html"
    "pages/mldashboard.html"
    "pages/login.html"
    "pages/register.html"
    "pages/settings.html"
)

echo ""
echo "📄 Verifying HTML pages..."
for page in "${HTML_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo -e "  ${GREEN}✓${NC} $page"
        # Check for relative paths
        if grep -q 'href="../css/style.css"' "$page"; then
            echo -e "    ${GREEN}✓${NC} CSS link correct"
        else
            echo -e "    ${YELLOW}⚠${NC} CSS link may need verification"
        fi
    else
        echo -e "  ${RED}❌${NC} Missing: $page"
        exit 1
    fi
done

# JavaScript modules check
JS_MODULES=(
    "js/config.js"
    "js/api.js"
    "js/app.js"
    "js/auth.js"
    "js/components.js"
    "js/router.js"
)

echo ""
echo "📜 Verifying JavaScript modules..."
for module in "${JS_MODULES[@]}"; do
    if [ -f "$module" ]; then
        echo -e "  ${GREEN}✓${NC} $module"
    else
        echo -e "  ${YELLOW}⚠${NC} Optional: $module"
    fi
done

# CSS check
echo ""
echo "🎨 Verifying CSS..."
if [ -f "css/style.css" ]; then
    echo -e "  ${GREEN}✓${NC} css/style.css"
else
    echo -e "  ${RED}❌${NC} Missing: css/style.css"
    exit 1
fi

# Configuration validation
echo ""
echo "⚙️ Validating configuration..."

# Check backend URL
if grep -q "backend-kzbh2zv05-paolos-projects-dc6990da.vercel.app" js/config.js; then
    echo -e "  ${GREEN}✓${NC} Backend API URL configured"
else
    echo -e "  ${RED}❌${NC} Backend API URL not found"
    exit 1
fi

# Check MT5 configuration
if grep -q "154.61.187.189" js/config.js; then
    echo -e "  ${GREEN}✓${NC} MT5 server configured"
else
    echo -e "  ${RED}❌${NC} MT5 server not configured"
    exit 1
fi

# Check Supabase configuration
if grep -q "jeewrxgqkgvtrphebcxz.supabase.co" js/config.js; then
    echo -e "  ${GREEN}✓${NC} Supabase database configured"
else
    echo -e "  ${RED}❌${NC} Supabase database not configured"
    exit 1
fi

# Check production environment
if grep -q "ENV: 'production'" js/config.js; then
    echo -e "  ${GREEN}✓${NC} Production environment set"
else
    echo -e "  ${YELLOW}⚠${NC} Environment not explicitly set to production"
fi

# Verify render.yaml
echo ""
echo "🐚 Validating render.yaml..."
if grep -q "type: web" render.yaml; then
    echo -e "  ${GREEN}✓${NC} Service type configured"
else
    echo -e "  ${RED}❌${NC} Service type not configured"
    exit 1
fi

if grep -q "env: static" render.yaml; then
    echo -e "  ${GREEN}✓${NC} Static hosting configured"
else
    echo -e "  ${RED}❌${NC} Static hosting not configured"
    exit 1
fi

# Verify _redirects
echo ""
echo "🔀 Validating _redirects..."
if grep -q "/dashboard /pages/dashboard.html 200" _redirects; then
    echo -e "  ${GREEN}✓${NC} SPA routing configured"
else
    echo -e "  ${RED}❌${NC} SPA routing not properly configured"
    exit 1
fi

# Check git status
echo ""
echo "📊 Git repository status..."
if git status > /dev/null 2>&1; then
    UNCOMMITTED=$(git diff --name-only)
    UNTRACKED=$(git ls-files --others --exclude-standard)
    
    if [ -z "$UNCOMMITTED" ] && [ -z "$UNTRACKED" ]; then
        echo -e "  ${GREEN}✓${NC} All files committed"
    else
        echo -e "  ${YELLOW}⚠${NC} Uncommitted changes detected:"
        if [ ! -z "$UNCOMMITTED" ]; then
            echo "    Modified: $UNCOMMITTED"
        fi
        if [ ! -z "$UNTRACKED" ]; then
            echo "    Untracked: $UNTRACKED"
        fi
        echo -e "    ${YELLOW}Remember to commit changes before deploying${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Not a git repository or git not available"
fi

# Final summary
echo ""
echo "==========================================="
echo -e "${GREEN}🎉 Deployment Verification Complete!${NC}"
echo ""
echo "📋 Summary:"
echo "  • Static HTML+JavaScript application ready"
echo "  • All pages and assets verified"
echo "  • Configuration validated"
echo "  • Render.com deployment files ready"
echo ""
echo "🚀 Ready for Render.com deployment!"
echo ""
echo "Next steps:"
echo "  1. Commit any remaining changes: git add . && git commit -m 'Deploy ready'"
echo "  2. Push to repository: git push origin main"
echo "  3. Create static site on Render.com"
echo "  4. Connect repository and deploy"
echo ""
echo "📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"