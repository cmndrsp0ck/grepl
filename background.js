// Background script for GrepFox extension

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

// Handle browser action click - create floating window directly
browser.browserAction.onClicked.addListener(async (tab) => {
  try {
    // Create floating window in the active tab
    await browser.tabs.sendMessage(tab.id, {
      action: 'createFloatingWindow'
    });
  } catch (error) {
    console.error('Failed to create floating window:', error);
    // Fallback to opening popup if content script not ready
    browser.browserAction.openPopup();
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
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Content script should be automatically injected via manifest
  }
});