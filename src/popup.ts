document.addEventListener('DOMContentLoaded', () => {
  const keywordsTextarea = document.getElementById('keywords') as HTMLTextAreaElement;
  const saveButton = document.getElementById('save') as HTMLButtonElement;
  const toggleCheckbox = document.getElementById('toggle') as HTMLInputElement;

  chrome.storage.sync.get(['keywords', 'isEnabled'], (result: { keywords?: string[], isEnabled?: boolean }) => {
    if (result.keywords) {
      keywordsTextarea.value = result.keywords.join('\n');
    }
    toggleCheckbox.checked = result.isEnabled || false;
  });

  toggleCheckbox.addEventListener('change', () => {
    const isEnabled = toggleCheckbox.checked;
    chrome.storage.sync.set({isEnabled}, () => {
      console.log('Extension toggled:', isEnabled);
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleExtension', isEnabled: isEnabled});
        }
      });
    });
  });

  saveButton.addEventListener('click', () => {
    const keywords = keywordsTextarea.value.split('\n').filter(keyword => keyword.trim() !== '');
    chrome.storage.sync.set({keywords: keywords}, () => {
      console.log('Keywords saved');
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0].id) {
          chrome.storage.sync.get(['isEnabled'], (result) => {
            chrome.tabs.sendMessage(tabs[0].id!, {action: 'updateKeywords', keywords: keywords, isEnabled: result.isEnabled});
          });
        }
      });
    });
  });
});