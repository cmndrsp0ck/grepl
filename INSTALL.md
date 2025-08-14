# GrepFox Installation Guide

GrepFox now supports both Firefox and Chrome! Follow the instructions below for your browser.

## Chrome Installation

### Method 1: Chrome Web Store (if published)
1. Visit the Chrome Web Store
2. Search for "GrepFox"
3. Click "Add to Chrome"

### Method 2: Developer Mode (Load Unpacked)
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the GrepFox extension folder
5. The extension uses `manifest.json` (Manifest V3)

## Firefox Installation

### Method 1: Firefox Add-ons (if published)
1. Visit Firefox Add-ons
2. Search for "GrepFox"
3. Click "Add to Firefox"

### Method 2: Developer Mode (Temporary Installation)
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. **Important**: Select `manifest-firefox.json` (not `manifest.json`)
5. The Firefox version uses Manifest V2

## Files Overview

- `manifest.json` - Chrome (Manifest V3)
- `manifest-firefox.json` - Firefox (Manifest V2)
- `background.js` - Chrome service worker
- `background-firefox.js` - Firefox background script
- `browser-polyfill.js` - Cross-browser compatibility layer
- All other files work in both browsers

## Usage

Once installed:
- **Click the extension icon** → Opens floating search window
- **Press `Ctrl+Shift+F`** → Opens floating search window
- **Drag the window** by its header to move it around
- **Search in real-time** as you type
- **Use checkboxes** for Perl regex and case-sensitive search
- **Navigate matches** with Enter/Shift+Enter or buttons
- **Close with red X** button

## Features

✅ **Cross-browser compatible** (Chrome & Firefox)
✅ **Floating, draggable search window**
✅ **Real-time search highlighting**
✅ **Perl regex support**
✅ **Case-sensitive option**
✅ **Keyboard navigation**
✅ **Persistent preferences**

## Troubleshooting

If the extension doesn't work:
1. Make sure you're using the correct manifest file for your browser
2. Check that the browser-polyfill.js file is included
3. Reload the extension in the browser's extension management page
4. Check the browser console for any error messages