#!/bin/bash
# Execute this script to remove application-local.properties from git tracking
# while keeping the file locally (it's already in .gitignore)

echo "Removing application-local.properties from git tracking..."
git rm --cached Back-End/src/main/resources/application-local.properties

echo ""
echo "Done! The file is now only in .gitignore and won't be tracked."
echo ""
echo "IMPORTANT: If this file was already committed, you should also:"
echo "1. Rotate the JWT secret in production"
echo "2. Rotate the database password"
echo "3. Consider using 'git filter-branch' or BFG to remove it from history"
echo ""
echo "To check if the file was ever committed:"
echo "git log --all --full-history -- Back-End/src/main/resources/application-local.properties"