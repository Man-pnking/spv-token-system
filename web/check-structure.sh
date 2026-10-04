#!/usr/bin/env bash
# Checks that every required file exists in the web workspace.

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
NC=$'\033[0m'

MISSING=0
FOUND=0

check() {
  local path="$1"
  if [ -f "$path" ]; then
    printf "${GREEN}[OK]${NC}      %s\n" "$path"
    FOUND=$((FOUND + 1))
  else
    printf "${RED}[MISSING]${NC} %s\n" "$path"
    MISSING=$((MISSING + 1))
  fi
}

check_dir() {
  local path="$1"
  if [ -d "$path" ]; then
    printf "${GREEN}[OK]${NC}      %s/\n" "$path"
  else
    printf "${RED}[MISSING]${NC} %s/\n" "$path"
    MISSING=$((MISSING + 1))
  fi
}

echo ""
echo "============================================================"
echo "SPV Web Workspace — Structure Check"
echo "============================================================"
echo ""
echo "Working directory: $(pwd)"
echo ""

echo "--- Root files ---"
check "package.json"
check "vite.config.js"
check "tailwind.config.js"
check "postcss.config.js"
check "index.html"
check ".env"
echo ""

echo "--- Source root ---"
check "src/main.jsx"
check "src/App.jsx"
check "src/index.css"
check "src/wagmi.js"
check "src/config.js"
echo ""

echo "--- Components ---"
check "src/components/Animated.jsx"
check "src/components/AnimatedBackground.jsx"
check "src/components/Navbar.jsx"
check "src/components/WalletButton.jsx"
check "src/components/Hero.jsx"
check "src/components/Intro.jsx"
check "src/components/CurveStats.jsx"
check "src/components/HowItWorks.jsx"
check "src/components/TradePanel.jsx"
check "src/components/Docs.jsx"
check "src/components/FAQ.jsx"
check "src/components/Footer.jsx"
echo ""

echo "--- Hooks ---"
check "src/hooks/useParallax.js"
check "src/hooks/useMousePosition.js"
check "src/hooks/useScrollReveal.js"
check "src/hooks/useSPVFees.js"
check "src/hooks/useSPVTrade.js"
check "src/hooks/useGasEstimate.js"
echo ""

echo "--- Utilities ---"
check "src/utils/format.js"
echo ""

echo "--- Generated files (from export script) ---"
check "src/abis/SPVToken.json"
check "src/abis/SPVBondingCurve.json"
check "src/abis/SPVRouter.json"
check "src/deployments.json"
echo ""

echo "--- Directories ---"
check_dir "src"
check_dir "src/components"
check_dir "src/hooks"
check_dir "src/utils"
check_dir "src/abis"
echo ""

echo "============================================================"
if [ "$MISSING" -eq 0 ]; then
  printf "${GREEN}All files present. Ready to build.${NC}\n"
else
  printf "${RED}%d file(s) missing. Fix before building.${NC}\n" "$MISSING"
fi
echo "============================================================"
echo ""