// Simple Firefox background script for grepl extension

// Handle keyboard shortcuts
browser.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-search') {
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

// Handle browser action click for Firefox
browser.browserAction.onClicked.addListener(async (tab) => {
  try {
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
    browser.storage.local.set({
      regexMode: false,
      caseSensitive: false
    });
  }
});