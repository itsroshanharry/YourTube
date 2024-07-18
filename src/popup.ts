document.addEventListener('DOMContentLoaded', () => {
    const keywordsTextarea = document.getElementById('keywords') as HTMLTextAreaElement;
    const saveButton = document.getElementById('save') as HTMLButtonElement;
  
    chrome.storage.sync.get(['keywords'], (result: { keywords?: string[] }) => {
      if (result.keywords) {
        keywordsTextarea.value = result.keywords.join('\n');
      }
    });
  
    saveButton.addEventListener('click', () => {
      const keywords = keywordsTextarea.value.split('\n').filter(keyword => keyword.trim() !== '');
      chrome.storage.sync.set({keywords: keywords}, () => {
        console.log('Keywords saved');
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          if (tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {action: 'updateKeywords', keywords: keywords});
          }
        });
      });
    });
  });