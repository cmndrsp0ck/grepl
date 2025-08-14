class GrepFoxSearch {
  constructor() {
    this.matches = [];
    this.currentMatchIndex = -1;
    this.highlightClass = 'grepfox-highlight';
    this.activeHighlightClass = 'grepfox-highlight-active';
    this.searchTerm = '';
    this.isRegexMode = false;
    this.walker = null;
    this.floatingWindow = null;

    this.setupMessageListener();
  }

  setupMessageListener() {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case 'search':
          this.performSearch(message.query, message.isRegex, message.isCaseSensitive);
          sendResponse({ matchCount: this.matches.length });
          break;
        case 'navigateNext':
          this.navigateToMatch(1);
          sendResponse({ currentIndex: this.currentMatchIndex, total: this.matches.length });
          break;
        case 'navigatePrev':
          this.navigateToMatch(-1);
          sendResponse({ currentIndex: this.currentMatchIndex, total: this.matches.length });
          break;
        case 'clearSearch':
          this.clearHighlights();
          sendResponse({});
          break;
        case 'createFloatingWindow':
          this.createFloatingWindow();
          sendResponse({});
          break;
        case 'closeFloatingWindow':
          this.closeFloatingWindow();
          sendResponse({});
          break;
      }
    });
  }

  performSearch(query, isRegex = false, isCaseSensitive = false) {
    this.clearHighlights();

    if (!query.trim()) {
      return;
    }

    this.searchTerm = query;
    this.isRegexMode = isRegex;
    this.isCaseSensitive = isCaseSensitive;
    this.matches = [];
    this.currentMatchIndex = -1;

    try {
      if (isRegex) {
        this.searchWithRegex(query, isCaseSensitive);
      } else {
        this.searchPlainText(query, isCaseSensitive);
      }

      if (this.matches.length > 0) {
        this.currentMatchIndex = 0;
        this.highlightActiveMatch();
      }
    } catch (error) {
      console.error('GrepFox search error:', error);
    }
  }

  searchPlainText(query, isCaseSensitive = false) {
    const flags = isCaseSensitive ? 'g' : 'gi';
    const regex = new RegExp(this.escapeRegExp(query), flags);
    this.findAndHighlightMatches(regex);
  }

  searchWithRegex(query, isCaseSensitive = false) {
    // Convert Perl regex features to JavaScript where possible
    let jsRegex = query;

    // Handle common Perl regex features
    jsRegex = jsRegex.replace(/\\b/g, '\\b'); // Word boundaries
    jsRegex = jsRegex.replace(/\\d/g, '\\d'); // Digits
    jsRegex = jsRegex.replace(/\\s/g, '\\s'); // Whitespace
    jsRegex = jsRegex.replace(/\\w/g, '\\w'); // Word characters

    const flags = isCaseSensitive ? 'g' : 'gi';
    const regex = new RegExp(jsRegex, flags);
    this.findAndHighlightMatches(regex);
  }

  findAndHighlightMatches(regex) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style elements
          const parent = node.parentElement;
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      const matches = [...text.matchAll(regex)];

      if (matches.length > 0) {
        this.highlightTextNode(textNode, matches);
      }
    });
  }

  highlightTextNode(textNode, matches) {
    const parent = textNode.parentNode;
    const text = textNode.textContent;

    let offset = 0;
    const fragment = document.createDocumentFragment();

    matches.forEach(match => {
      const matchStart = match.index;
      const matchEnd = matchStart + match[0].length;

      // Add text before match
      if (matchStart > offset) {
        fragment.appendChild(document.createTextNode(text.slice(offset, matchStart)));
      }

      // Create highlight span
      const highlight = document.createElement('span');
      highlight.className = this.highlightClass;
      highlight.textContent = match[0];
      highlight.setAttribute('data-grepfox-match', this.matches.length);

      fragment.appendChild(highlight);
      this.matches.push(highlight);

      offset = matchEnd;
    });

    // Add remaining text
    if (offset < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(offset)));
    }

    parent.replaceChild(fragment, textNode);
  }

  navigateToMatch(direction) {
    if (this.matches.length === 0) return;

    // Remove active class from current match
    if (this.currentMatchIndex >= 0) {
      this.matches[this.currentMatchIndex].classList.remove(this.activeHighlightClass);
    }

    // Calculate new index
    this.currentMatchIndex += direction;

    if (this.currentMatchIndex >= this.matches.length) {
      this.currentMatchIndex = 0; // Wrap to beginning
    } else if (this.currentMatchIndex < 0) {
      this.currentMatchIndex = this.matches.length - 1; // Wrap to end
    }

    this.highlightActiveMatch();
  }

  highlightActiveMatch() {
    if (this.currentMatchIndex >= 0 && this.currentMatchIndex < this.matches.length) {
      const activeMatch = this.matches[this.currentMatchIndex];
      activeMatch.classList.add(this.activeHighlightClass);

      // Scroll to the active match
      activeMatch.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  clearHighlights() {
    const highlights = document.querySelectorAll(`.${this.highlightClass}`);
    highlights.forEach(highlight => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    });

    this.matches = [];
    this.currentMatchIndex = -1;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  createFloatingWindow() {
    if (this.floatingWindow) {
      this.closeFloatingWindow();
    }

    // Create floating window container
    this.floatingWindow = document.createElement('div');
    this.floatingWindow.className = 'grepfox-floating-window';
    this.floatingWindow.innerHTML = `
      <div class="grepfox-float-header">
        <h3>GrepFox Search</h3>
        <div class="grepfox-window-controls">
          <button class="grepfox-close-btn" title="Close">×</button>
        </div>
      </div>
      <div class="grepfox-float-content">
        <div class="grepfox-search-section">
          <div class="grepfox-search-input-container">
            <input type="text" class="grepfox-search-input" placeholder="Enter search term..." autocomplete="off">
            <button class="grepfox-clear-btn" title="Clear search">×</button>
          </div>
          <div class="grepfox-options">
            <label class="grepfox-checkbox-container">
              <input type="checkbox" class="grepfox-regex-checkbox">
              <span class="grepfox-checkmark"></span>
              Perl Regex
            </label>
            <label class="grepfox-checkbox-container">
              <input type="checkbox" class="grepfox-case-sensitive-checkbox">
              <span class="grepfox-checkmark"></span>
              Case Sensitive
            </label>
          </div>
        </div>
        <div class="grepfox-navigation-section">
          <div class="grepfox-match-info">
            <span class="grepfox-match-counter">0 matches</span>
          </div>
          <div class="grepfox-nav-controls">
            <button class="grepfox-prev-btn" title="Previous match (Shift+Enter)" disabled>↑</button>
            <button class="grepfox-next-btn" title="Next match (Enter)" disabled>↓</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.floatingWindow);
    this.setupFloatingWindowEvents();
    this.makeWindowDraggable();

    // Focus the search input
    const searchInput = this.floatingWindow.querySelector('.grepfox-search-input');
    searchInput.focus();
  }

  setupFloatingWindowEvents() {
    const searchInput = this.floatingWindow.querySelector('.grepfox-search-input');
    const regexCheckbox = this.floatingWindow.querySelector('.grepfox-regex-checkbox');
    const caseSensitiveCheckbox = this.floatingWindow.querySelector('.grepfox-case-sensitive-checkbox');
    const matchCounter = this.floatingWindow.querySelector('.grepfox-match-counter');
    const prevBtn = this.floatingWindow.querySelector('.grepfox-prev-btn');
    const nextBtn = this.floatingWindow.querySelector('.grepfox-next-btn');
    const clearBtn = this.floatingWindow.querySelector('.grepfox-clear-btn');
    const closeBtn = this.floatingWindow.querySelector('.grepfox-close-btn');

    let searchTimeout = null;

    // Real-time search
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value, regexCheckbox.checked, caseSensitiveCheckbox.checked);
        this.updateFloatingUI();
      }, 300);
    });

    // Regex checkbox
    regexCheckbox.addEventListener('change', () => {
      if (searchInput.value.trim()) {
        this.performSearch(searchInput.value, regexCheckbox.checked, caseSensitiveCheckbox.checked);
        this.updateFloatingUI();
      }
    });

    // Case sensitive checkbox
    caseSensitiveCheckbox.addEventListener('change', () => {
      if (searchInput.value.trim()) {
        this.performSearch(searchInput.value, regexCheckbox.checked, caseSensitiveCheckbox.checked);
        this.updateFloatingUI();
      }
    });

    // Navigation
    prevBtn.addEventListener('click', () => {
      this.navigateToMatch(-1);
      this.updateFloatingUI();
    });

    nextBtn.addEventListener('click', () => {
      this.navigateToMatch(1);
      this.updateFloatingUI();
    });

    // Clear search
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      this.clearHighlights();
      this.updateFloatingUI();
    });

    // Close window
    closeBtn.addEventListener('click', () => {
      this.closeFloatingWindow();
    });

    // Keyboard shortcuts
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.navigateToMatch(-1);
        } else {
          this.navigateToMatch(1);
        }
        this.updateFloatingUI();
      } else if (e.key === 'Escape') {
        this.closeFloatingWindow();
      }
    });
  }

  updateFloatingUI() {
    if (!this.floatingWindow) return;

    const matchCounter = this.floatingWindow.querySelector('.grepfox-match-counter');
    const prevBtn = this.floatingWindow.querySelector('.grepfox-prev-btn');
    const nextBtn = this.floatingWindow.querySelector('.grepfox-next-btn');
    const clearBtn = this.floatingWindow.querySelector('.grepfox-clear-btn');
    const searchInput = this.floatingWindow.querySelector('.grepfox-search-input');

    // Update match counter
    if (this.matches.length === 0) {
      matchCounter.textContent = searchInput.value.trim() ? 'No matches' : '0 matches';
    } else {
      matchCounter.textContent = `${this.currentMatchIndex + 1} of ${this.matches.length}`;
    }

    // Update navigation buttons
    const hasMatches = this.matches.length > 0;
    prevBtn.disabled = !hasMatches;
    nextBtn.disabled = !hasMatches;

    // Show/hide clear button
    clearBtn.style.display = searchInput.value.trim() ? 'flex' : 'none';
  }

  makeWindowDraggable() {
    const header = this.floatingWindow.querySelector('.grepfox-float-header');
    let isDragging = false;
    let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

    header.addEventListener('mousedown', (e) => {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
      header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        this.floatingWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      header.style.cursor = 'grab';
    });
  }

  closeFloatingWindow() {
    if (this.floatingWindow) {
      this.clearHighlights();
      this.floatingWindow.remove();
      this.floatingWindow = null;
    }
  }
}

// Initialize the search functionality
const grepFoxSearch = new GrepFoxSearch();
