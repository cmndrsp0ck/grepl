class GrepFoxPopup {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.regexCheckbox = document.getElementById('regex-checkbox');
    this.keepOpenCheckbox = document.getElementById('keep-open-checkbox');
    this.matchCounter = document.getElementById('match-counter');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.detachBtn = document.getElementById('detach-btn');
    
    this.currentMatchIndex = -1;
    this.totalMatches = 0;
    this.searchTimeout = null;
    this.isDetached = false;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.searchInput.focus();
    
    // Load saved preferences
    this.loadPreferences();
  }
  
  setupEventListeners() {
    // Real-time search as user types
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300); // Debounce search
    });
    
    // Regex checkbox change
    this.regexCheckbox.addEventListener('change', () => {
      this.savePreferences();
      if (this.searchInput.value.trim()) {
        this.performSearch(this.searchInput.value);
      }
    });
    
    // Keep open checkbox change
    this.keepOpenCheckbox.addEventListener('change', () => {
      this.savePreferences();
    });
    
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => {
      this.navigatePrevious();
      this.handlePopupClose();
    });
    this.nextBtn.addEventListener('click', () => {
      this.navigateNext();
      this.handlePopupClose();
    });
    
    // Clear button
    this.clearBtn.addEventListener('click', () => this.clearSearch());
    
    // Detach button
    this.detachBtn.addEventListener('click', () => this.detachWindow());
    
    // Keyboard shortcuts
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.navigatePrevious();
        } else {
          this.navigateNext();
        }
        this.handlePopupClose();
      } else if (e.key === 'Escape') {
        this.clearSearch();
      }
    });
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        this.searchInput.focus();
      }
    });
  }
  
  async performSearch(query) {
    if (!query.trim()) {
      this.clearSearch();
      return;
    }
    
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      const response = await browser.tabs.sendMessage(tab.id, {
        action: 'search',
        query: query,
        isRegex: this.regexCheckbox.checked
      });
      
      this.totalMatches = response.matchCount;
      this.currentMatchIndex = this.totalMatches > 0 ? 1 : 0;
      this.updateUI();
      
    } catch (error) {
      console.error('Search error:', error);
      this.showError('Search failed. Please refresh the page and try again.');
    }
  }
  
  async navigateNext() {
    if (this.totalMatches === 0) return;
    
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      const response = await browser.tabs.sendMessage(tab.id, {
        action: 'navigateNext'
      });
      
      this.currentMatchIndex = response.currentIndex + 1; // Convert to 1-based
      this.updateUI();
      
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
  
  async navigatePrevious() {
    if (this.totalMatches === 0) return;
    
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      const response = await browser.tabs.sendMessage(tab.id, {
        action: 'navigatePrev'
      });
      
      this.currentMatchIndex = response.currentIndex + 1; // Convert to 1-based
      this.updateUI();
      
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }
  
  async clearSearch() {
    this.searchInput.value = '';
    this.totalMatches = 0;
    this.currentMatchIndex = -1;
    
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      await browser.tabs.sendMessage(tab.id, {
        action: 'clearSearch'
      });
      
    } catch (error) {
      console.error('Clear error:', error);
    }
    
    this.updateUI();
  }
  
  updateUI() {
    // Update match counter
    if (this.totalMatches === 0) {
      this.matchCounter.textContent = this.searchInput.value.trim() ? 'No matches' : '0 matches';
    } else {
      this.matchCounter.textContent = `${this.currentMatchIndex} of ${this.totalMatches}`;
    }
    
    // Update navigation buttons
    const hasMatches = this.totalMatches > 0;
    this.prevBtn.disabled = !hasMatches;
    this.nextBtn.disabled = !hasMatches;
    
    // Show/hide clear button
    this.clearBtn.style.display = this.searchInput.value.trim() ? 'flex' : 'none';
  }
  
  async detachWindow() {
    if (this.isDetached) return;
    
    try {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      // Create floating window in content script
      await browser.tabs.sendMessage(tab.id, {
        action: 'createFloatingWindow'
      });
      
      this.isDetached = true;
      
      // Close popup
      window.close();
      
    } catch (error) {
      console.error('Failed to create floating window:', error);
      this.showError('Failed to create floating window');
    }
  }
  
  
  savePreferences() {
    browser.storage.local.set({
      regexMode: this.regexCheckbox.checked,
      keepOpen: this.keepOpenCheckbox.checked
    });
  }
  
  async loadPreferences() {
    try {
      const result = await browser.storage.local.get(['regexMode', 'keepOpen']);
      if (result.regexMode !== undefined) {
        this.regexCheckbox.checked = result.regexMode;
      }
      if (result.keepOpen !== undefined) {
        this.keepOpenCheckbox.checked = result.keepOpen;
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }
  
  handlePopupClose() {
    // Only close popup if "Keep Open" is not checked
    if (!this.keepOpenCheckbox.checked) {
      setTimeout(() => {
        window.close();
      }, 100); // Small delay to ensure navigation completes
    }
  }
  
  showError(message) {
    this.matchCounter.textContent = message;
    this.matchCounter.style.color = '#ff4444';
    setTimeout(() => {
      this.matchCounter.style.color = '';
      this.updateUI();
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GrepFoxPopup();
});