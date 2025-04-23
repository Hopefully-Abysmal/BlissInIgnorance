// contentScript.js

// Load blocked terms from local storage
(async () => {
    const { blockedWords = [] } = await chrome.storage.local.get("blockedWords");
  
    // Replace each blocked word in the document body with █████
    function redactWords() {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentNode || node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;
        blockedWords.forEach(word => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          node.textContent = node.textContent.replace(regex, '█████');
        });
      }
    }
  
    // Initial redaction and observe for changes
    redactWords();
    const observer = new MutationObserver(redactWords);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  })();