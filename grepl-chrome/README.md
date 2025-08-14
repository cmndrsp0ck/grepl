# grepl for Chrome

This is the Chrome-specific version of grepl using Manifest V3.

## Installation

1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select this `grepfox-chrome` folder

## Features

- ✅ Floating search window (click extension icon)
- ✅ Real-time search highlighting
- ✅ Case-sensitive search option
- ✅ Perl regex support
- ✅ Keyboard shortcut: `Ctrl+Shift+F`
- ✅ Navigate matches with Enter/Shift+Enter
- ✅ Draggable floating window

## Files

- `manifest.json` - Chrome Manifest V3
- `background-chrome.js` - Chrome service worker
- `content-chrome.js` - Content script for page search
- `content.css` - Search highlighting styles
- `popup-chrome.html/js` - Extension popup (fallback)
- `popup.css` - Popup styles
- `icon*.png` - Extension icons

## Usage

1. **Click the extension icon** → Opens floating search window
2. **Press `Ctrl+Shift+F`** → Opens floating search window
3. **Search in real-time** as you type
4. **Check "Perl Regex"** for regex search
5. **Check "Case Sensitive"** for case-sensitive search
6. **Navigate with Enter/Shift+Enter** or buttons
7. **Drag window** by header to move it around
8. **Close with red X** button

## Notes

- Extension works on regular web pages
- Cannot run on `chrome://` pages (browser security restriction)
- Content script injection with automatic fallback
- All preferences are saved between sessions

This version is completely independent of the Firefox version and optimized specifically for Chrome.