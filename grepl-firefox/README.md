# grepl for Firefox

This is the Firefox-specific version of grepl using Manifest V2.

## Installation

1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from this directory

## Features

- ✅ Floating search window (click extension icon)
- ✅ Real-time search highlighting
- ✅ Case-sensitive search option
- ✅ Perl regex support
- ✅ Keyboard shortcut: `Ctrl+Shift+F`
- ✅ Navigate matches with Enter/Shift+Enter

## Files

- `manifest.json` - Firefox Manifest V2
- `background-firefox.js` - Firefox background script
- `content.js` - Content script for page search
- `content.css` - Search highlighting styles
- `popup.html/js/css` - Extension popup (fallback)
- `icon*.png` - Extension icons

This version is completely independent of the Chrome version and should work without any conflicts.