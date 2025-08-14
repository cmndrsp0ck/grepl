#!/bin/bash

# This script packages the Chrome and Firefox extensions into zip files.

# Create a directory for the packaged files
mkdir -p dist

# Package the Chrome extension
echo "Packaging Chrome extension..."
(cd grepl-chrome && zip -r -FS ../dist/grepl-chrome.zip .)

# Package the Firefox extension
echo "Packaging Firefox extension..."
(cd grepl-firefox && zip -r -FS ../dist/grepl-firefox.zip .)

echo "Packaging complete."
echo "Files are located in the 'dist' directory."
