# GrepFox - Advanced Firefox Search Extension

GrepFox is a powerful Firefox extension that provides advanced search capabilities with real-time highlighting, Perl regex support, and easy navigation between matches.

## Features

- **Real-time search**: Results appear as you type
- **Perl regex support**: Use powerful regular expressions with `-P` flag behavior
- **Visual highlighting**: All matches highlighted on the page with active match distinction
- **Easy navigation**: Forward/backward navigation between matches
- **Keyboard shortcuts**: 
  - `Enter` - Next match
  - `Shift+Enter` - Previous match
  - `Ctrl+Shift+F` - Toggle search popup
- **Detachable window**: Pop out search interface into a floating window
- **Match counter**: Shows current match position and total count

## Installation

### Manual Installation (Development)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Navigate to the GrepFox directory and select `manifest.json`

### From Source

1. Clone or download this repository
2. Follow the manual installation steps above

## Usage

### Basic Search
1. Click the GrepFox icon in the toolbar or press `Ctrl+Shift+F`
2. Type your search term in the input field
3. Matches will be highlighted automatically as you type
4. Use the navigation buttons or `Enter`/`Shift+Enter` to move between matches

### Regex Search
1. Check the "Perl Regex (-P)" checkbox
2. Enter your regular expression (e.g., `\\d+` for numbers, `\\b\\w+@\\w+\\.\\w+\\b` for emails)
3. Navigate through matches as normal

### Detached Window
1. Click the "⚏" button in the popup header
2. The search interface will open in a floating, draggable window
3. The window can be resized and moved around the page

## Regex Examples

- `\\d+` - Match numbers
- `\\b\\w+@\\w+\\.\\w+\\b` - Match email addresses
- `https?://\\S+` - Match URLs
- `\\b[A-Z]{2,}\\b` - Match acronyms (2+ uppercase letters)
- `#[0-9a-fA-F]{6}` - Match hex color codes

## Development

The extension consists of:

- `manifest.json` - Extension configuration
- `content.js` - Page search and highlighting logic
- `content.css` - Highlighting styles
- `popup.html/js/css` - Search interface
- `background.js` - Extension background tasks

## Browser Compatibility

- Firefox 57+ (WebExtensions API)
- Should work on Firefox for Android (untested)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License