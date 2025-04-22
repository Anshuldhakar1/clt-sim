
#!/usr/bin/env bash

# Exit if any command fails
set -e

# Build the application
echo "Building the application..."
npm run build

# Create or update the gh-pages branch
echo "Deploying to GitHub Pages..."
git branch -D gh-pages || true
git checkout --orphan gh-pages
git add -f dist/
git commit -m "Deploy to GitHub Pages"

# Push to gh-pages branch
echo "Pushing to gh-pages branch..."
git subtree push --prefix dist origin gh-pages

# Return to the original branch
git checkout -

echo "Successfully deployed to GitHub Pages!"
echo "Your site should be available at https://[username].github.io/[repository-name]/"
