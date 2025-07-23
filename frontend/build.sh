#!/bin/bash
echo "Starting frontend build process..."

# Install dependencies
npm install

# Build the project
npm run build

# Ensure _redirects file is in place
cp public/_redirects dist/ 2>/dev/null || echo "/* /index.html 200" > dist/_redirects

# Verify the _redirects file
echo "Contents of dist/_redirects:"
cat dist/_redirects

echo "Build completed successfully!"
