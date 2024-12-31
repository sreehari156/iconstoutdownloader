#!/usr/bin/env bash
# Install system dependencies for Playwright
apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxrandr2 \
  libxdamage1 \
  libxcomposite1 \
  libxkbcommon0 \
  libxshmfence1 \
  libgbm1 \
  libasound2 \
  fonts-liberation \
  libfontconfig1

# Install Playwright browsers
npx playwright install
