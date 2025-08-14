// Background script for GrepFox extension (Firefox compatible)
// Note: browser-polyfill.js is loaded via manifest for Firefox

// Handle keyboard shortcuts
browser.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-search') {
    // Create floating window in active tab
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      await browser.tabs.sendMessage(tab.id, {
        action: 'createFloatingWindow'
      });
    } catch (error) {
      console.error('Failed to create floating window via keyboard shortcut:', error);
    }
  }
});

// Handle extension action click - create floating window directly  
// Use action for Chrome/Manifest V3, browserAction for Firefox/Manifest V2
const actionAPI = browser.action || browser.browserAction;
actionAPI.onClicked.addListener(async (tab) => {
  try {
    // Create floating window in the active tab
    await browser.tabs.sendMessage(tab.id, {
      action: 'createFloatingWindow'
    });
  } catch (error) {
    console.error('Failed to create floating window:', error);
  }
});

// Handle extension installation
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default preferences
    browser.storage.local.set({
      regexMode: false,
      caseSensitive: false
    });
  }
});

// Handle tab updates to ensure content script is ready
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('moz-extension://')) {
    // Content script should be automatically injected via manifest
  }
});