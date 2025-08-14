# grepl

`grepl` is a powerful browser extension that adds a floating search window to your browser, allowing you to find text on any webpage with advanced features like regular expressions and case-sensitive searching.

This repository contains two separate versions of the extension:
- **`grepl-chrome`**: For Google Chrome and other Chromium-based browsers (using Manifest V3).
- **`grepl-firefox`**: For Mozilla Firefox (using Manifest V2).

## Features

- **Floating Search Window**: A convenient, draggable search interface that doesn't obstruct your view.
- **Real-Time Highlighting**: Matches are highlighted on the page as you type.
- **Perl Regex Support**: Use powerful Perl-compatible regular expressions for advanced search patterns.
- **Case-Sensitive Search**: Easily toggle case-sensitivity for your searches.
- **Keyboard Shortcuts**: Use `Ctrl+Shift+F` to quickly open the search window and `Enter`/`Shift+Enter` to navigate between matches.
- **Persistent Preferences**: Your search settings are saved between sessions.

## Packaging for Distribution

To share the extension with others or to upload it to a web store, you need to package it as a `.zip` file.

### For Chrome

1.  Navigate to the `grepl-chrome/` directory.
2.  Select all the files within the directory (`manifest.json`, `background-chrome.js`, etc.).
3.  Compress the selected files into a single `grepl-chrome.zip` file.

The resulting `.zip` file is ready to be uploaded to the Chrome Web Store or shared directly with other users.

### For Firefox

1.  Navigate to the `grepl-firefox/` directory.
2.  Select all the files within the directory (`manifest.json`, `background-firefox.js`, etc.).
3.  Compress the selected files into a single `grepl-firefox.zip` file.

The resulting `.zip` file is ready to be uploaded to the Mozilla Add-on portal or shared directly.

## Installation

For detailed instructions on how to install the extension in your specific browser for development or personal use, please refer to the `README.md` file inside the corresponding directory:

- **Chrome**: [`grepl-chrome/README.md`](grepl-chrome/README.md)
- **Firefox**: [`grepl-firefox/README.md`](grepl-firefox/README.md)
