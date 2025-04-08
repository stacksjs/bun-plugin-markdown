#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  bun install
fi

# Build the source code if needed
if [ ! -d "dist" ]; then
  echo "Building project..."
  bun build ./src/index.ts --outdir ./dist --target bun
fi

# Run the test server
echo "Starting test server..."
bun run test/test-loader.ts