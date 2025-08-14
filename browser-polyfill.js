// Simple browser API polyfill for cross-browser compatibility
(function() {
  'use strict';
  
  // If chrome API exists but browser doesn't, create browser as alias to chrome
  if (typeof chrome !== 'undefined' && typeof browser === 'undefined') {
    window.browser = chrome;
  }
  
  // If neither exists, we have a problem
  if (typeof browser === 'undefined' && typeof chrome === 'undefined') {
    console.error('GrepFox: No browser extension API found');
  }
})();