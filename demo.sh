#!/bin/bash
# ============================================
# AI Data Extractor - Demo & Proof Script
# ============================================
# This script starts all services, runs tests, and generates proof output.
# Usage: bash demo.sh
#
# Prerequisites:
#   - Node.js 18+
#   - Python 3.10+
#   - pip install fastapi uvicorn httpx pydantic

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "═══════════════════════════════════════════"
echo "  AI Data Extractor - Demo Run"
echo "═══════════════════════════════════════════"
echo ""

# Cleanup on exit
cleanup() {
  echo "Shutting down services..."
  kill $MOCK_PID $SGLANG_SVC_PID $NEXT_PID 2>/dev/null || true
}
trap cleanup EXIT

# 1. Start Mock SGLang Server
echo "▶ Starting Mock SGLang Server (port 30000)..."
python3 sglang-service/mock_sglang_server.py &
MOCK_PID=$!
sleep 1

# 2. Start SGLang Service
echo "▶ Starting SGLang Extraction Service (port 8100)..."
cd sglang-service
pip install -q -r requirements.txt 2>/dev/null
python3 -m uvicorn main:app --port 8100 --log-level warning &
SGLANG_SVC_PID=$!
cd "$SCRIPT_DIR"
sleep 2

# 3. Start Next.js
echo "▶ Starting Next.js App (port 3000)..."
npm run dev -- --port 3000 &
NEXT_PID=$!
sleep 5

echo ""
echo "═══════════════════════════════════════════"
echo "  Running E2E Tests"
echo "═══════════════════════════════════════════"
echo ""

# 4. Run E2E tests
node test/e2e.js 2>&1 | tee test/results.txt

echo ""
echo "═══════════════════════════════════════════"
echo "  Test results saved to: test/results.txt"
echo "═══════════════════════════════════════════"
