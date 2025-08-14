class greplPopup {
  constructor() {
    this.searchInput = document.getElementById('search-input');
    this.regexCheckbox = document.getElementById('regex-checkbox');
    this.caseSensitiveCheckbox = document.getElementById('case-sensitive-checkbox');
    this.matchCounter = document.getElementById('match-counter');
    this.prevBtn = document.getElementById('prev-btn');
    this.nextBtn = document.getElementById('next-btn');
    this.clearBtn = document.getElementById('clear-btn');
    
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
    
    // Case sensitive checkbox change
    this.caseSensitiveCheckbox.addEventListener('change', () => {
      this.savePreferences();
      if (this.searchInput.value.trim()) {
        this.performSearch(this.searchInput.value);
      }
    });
    
    
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.navigatePrevious());
    this.nextBtn.addEventListener('click', () => this.navigateNext());
    
    // Clear button
    this.clearBtn.addEventListener('click', () => this.clearSearch());
    
    // Keyboard shortcuts
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.navigatePrevious();
        } else {
          this.navigateNext();
        }
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
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'search',
        query: query,
        isRegex: this.regexCheckbox.checked,
        isCaseSensitive: this.caseSensitiveCheckbox.checked
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
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, {
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
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, {
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
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.tabs.sendMessage(tab.id, {
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
  
  savePreferences() {
    chrome.storage.local.set({
      regexMode: this.regexCheckbox.checked,
      caseSensitive: this.caseSensitiveCheckbox.checked
    });
  }
  
  async loadPreferences() {
    try {
      const result = await chrome.storage.local.get(['regexMode', 'caseSensitive']);
      if (result.regexMode !== undefined) {
        this.regexCheckbox.checked = result.regexMode;
      }
      if (result.caseSensitive !== undefined) {
        this.caseSensitiveCheckbox.checked = result.caseSensitive;
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
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
  new greplPopup();
});