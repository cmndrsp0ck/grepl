// Background script for GrepFox extension

// Handle keyboard shortcuts
browser.commands.onCommand.addListener((command) => {
  if (command === 'toggle-search') {
    // Open popup or focus search input
    browser.browserAction.openPopup();
  }
});

// Handle browser action click
browser.browserAction.onClicked.addListener((tab) => {
  // This will be handled by the popup
});

// Handle extension installation
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default preferences
    browser.storage.local.set({
      regexMode: false,
      keepOpen: false
    });
  }
});

// Handle tab updates to ensure content script is ready
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Content script should be automatically injected via manifest
  }
});