#!/usr/bin/env bash

# Set the path to where Playwright will install browsers
export PLAYWRIGHT_BROWSERS_PATH=/opt/render/.cache/ms-playwright  # Adjust this if necessary

# Ensure no download of browsers if you already have them available
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install Playwright and necessary browsers
npx playwright install --with-deps

# Install other dependencies
npm install
