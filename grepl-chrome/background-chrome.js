// Chrome service worker for grepl extension

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-search') {
    // Create floating window in active tab
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Skip if on restricted pages
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        console.log('grepl: Cannot run on restricted pages');
        return;
      }
      
      await chrome.tabs.sendMessage(tab.id, {
        action: 'createFloatingWindow'
      });
    } catch (error) {
      console.error('Failed to create floating window via keyboard shortcut:', error);
      console.log('This might happen if the page hasn\'t finished loading or content script failed to inject');
      
      // Try to inject the content script manually as fallback
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content-chrome.js']
        });
        
        await chrome.scripting.insertCSS({
          target: { tabId: tab.id },
          files: ['content.css']
        });
        
        // Try sending message again after manual injection
        setTimeout(async () => {
          try {
            await chrome.tabs.sendMessage(tab.id, {
              action: 'createFloatingWindow'
            });
          } catch (retryError) {
            console.error('Keyboard shortcut retry failed:', retryError);
          }
        }, 500);
        
      } catch (injectError) {
        console.error('Manual injection failed for keyboard shortcut:', injectError);
      }
    }
  }
});

// Handle extension action click - create floating window directly
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Skip if on restricted pages
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
      console.log('grepl: Cannot run on restricted pages');
      return;
    }
    
    // Create floating window in the active tab
    await chrome.tabs.sendMessage(tab.id, {
      action: 'createFloatingWindow'
    });
  } catch (error) {
    console.error('Failed to create floating window:', error);
    console.log('This might happen if the page hasn\'t finished loading or content script failed to inject');
    
    // Try to inject the content script manually as fallback
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-chrome.js']
      });
      
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content.css']
      });
      
      // Try sending message again after manual injection
      setTimeout(async () => {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'createFloatingWindow'
          });
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }, 500);
      
    } catch (injectError) {
      console.error('Manual injection failed:', injectError);
    }
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default preferences
    chrome.storage.local.set({
      regexMode: false,
      caseSensitive: false
    });
  }
});

// Handle tab updates to ensure content script is ready
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    // Content script should be automatically injected via manifest
  }
});